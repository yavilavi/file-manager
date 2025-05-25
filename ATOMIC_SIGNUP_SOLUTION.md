# Solución de Atomicidad en el Proceso de Signup

## Problema Identificado

El proceso de signup de compañías **NO era atómico**, causando inconsistencia de datos:

- Si fallaba la creación de departamentos, la compañía quedaba creada
- Si fallaba cualquier paso después de crear la compañía, se producían datos huérfanos
- El proceso no seguía el principio ACID (Atomicity, Consistency, Isolation, Durability)

## Causa Raíz del Problema

El `CompanyOnboardingUseCase` tenía una **falsa atomicidad**:

```typescript
// ❌ PROBLEMÁTICO: Falsa transacción
async execute(command: OnboardCompanyCommand): Promise<OnboardingResult> {
  return await this.prisma.client.$transaction(async (tx) => {
    // ❌ Este call NO usa la transacción tx
    const companyResult = await this.companyCreationUseCase.execute(companyCommand);
    
    // ❌ Este call tampoco usa la transacción tx  
    const createdUser = await this.userRegistrationUseCase.execute(userCommand);
  });
}
```

### Problemas Específicos:

1. **Anidación de transacciones**: Los use cases internos creaban sus propias transacciones
2. **CompanyCreationUseCase** llamaba al repositorio **sin la transacción** del padre
3. **UserRegistrationUseCase** también operaba fuera de la transacción principal
4. Solo algunas operaciones (departamento del usuario, plan) usaban la transacción `tx`

## Solución Implementada

### ✅ CompanyOnboardingUseCase - Versión Atómica

```typescript
async execute(command: OnboardCompanyCommand): Promise<OnboardingResult> {
  return await this.prisma.client.$transaction(async (tx) => {
    // 1. ✅ Validación usando la transacción
    const existingCompany = await tx.company.findFirst({
      where: { nit: company.nit, deletedAt: null }
    });

    // 2. ✅ Crear compañía usando la transacción
    const createdCompany = await tx.company.create({
      data: { name, nit, tenantId, canSendEmail: false }
    });

    // 3. ✅ Crear TODOS los departamentos usando la transacción
    const createdDepartments = [];
    for (let i = 0; i < company.departments.length; i++) {
      const department = await tx.department.create({
        data: { name: company.departments[i].name, tenantId }
      });
      createdDepartments.push(department);
    }

    // 4. ✅ Crear usuario usando la transacción
    const createdUser = await tx.user.create({
      data: { name, email, hashedPassword, tenantId, departmentId, isActive: true }
    });

    // 5. ✅ Crear plan de compañía usando la transacción
    if (company.planId) {
      await tx.companyPlan.create({ data: { tenantId, planId, ... } });
    }

    // 6. ✅ Crear créditos de compañía usando la transacción
    await tx.companyCredits.create({
      data: { tenantId, totalPurchased: 0, currentBalance: 0 }
    });

    // 7. ✅ Inicializar roles usando la transacción
    await this.roleInitializationService.initializeSuperAdminRole({
      tenantId, userId: createdUser.id, tx // ← Pasa la transacción
    });

    return { redirectUrl };
  });
}
```

### Beneficios de la Solución

#### 1. **Verdadera Atomicidad**
- **TODO o NADA**: Si cualquier operación falla, toda la transacción se revierte
- **No más datos huérfanos**: Imposible que quede una compañía sin departamentos o usuarios
- **Consistencia garantizada**: Estado coherente en todo momento

#### 2. **Operaciones Incluidas en la Transacción**
- ✅ Validación de NIT duplicado
- ✅ Creación de compañía
- ✅ Creación de **TODOS** los departamentos
- ✅ Creación del usuario administrador
- ✅ Creación del plan de compañía (si aplica)
- ✅ Inicialización de créditos de compañía
- ✅ Creación e asignación de rol super admin

#### 3. **Manejo de Errores Robusto**
```typescript
// Si CUALQUIERA de estas operaciones falla:
// - Validación de NIT
// - Creación de compañía
// - Creación de departamentos
// - Creación de usuario
// - Asignación de roles
// TODA la transacción se revierte automáticamente
```

#### 4. **Eventos Post-Transacción**
```typescript
// Los eventos se emiten SOLO después de que la transacción es exitosa
setImmediate(() => {
  this.eventEmitter.emit('company.created', { ... });
  this.eventEmitter.emit('user.created', { ... });
});
```

## Cambios Realizados

### 1. **Refactorización del CompanyOnboardingUseCase**
- ❌ Eliminado: Dependencias a `CompanyCreationUseCase` y `UserRegistrationUseCase`
- ✅ Agregado: Lógica directa usando la transacción `tx`
- ✅ Agregado: Creación automática de `CompanyCredits`
- ✅ Mejorado: Manejo de errores y validaciones

### 2. **Simplificación del AuthModule**
```typescript
// ❌ Removido: Use cases que creaban transacciones separadas
// UserRegistrationUseCase
// CompanyCreationUseCase

// ❌ Removido: Dependencias innecesarias
// CompanyModule
// COMPANY_REPOSITORY
// PrismaCompanyRepository  
// CompanyMapper

// ✅ Mantenido: Solo las dependencias necesarias
// CompanyOnboardingUseCase (refactorizado)
// AuthenticationUseCase
```

### 3. **Actualización de Exports**
```typescript
// ❌ Removido de index.ts
export * from './application/use-cases/user-registration.use-case';
export * from './application/use-cases/company-creation.use-case';

// ✅ Mantenido
export * from './application/use-cases/company-onboarding.use-case';
export * from './application/use-cases/authentication.use-case';
```

## Tests de Atomicidad

Creados tests completos que verifican:

### ✅ Casos de Éxito
- Todas las operaciones se completan exitosamente
- Eventos se emiten después de la transacción
- URL de redirección se genera correctamente

### ✅ Casos de Falla
- **NIT duplicado**: Transacción se aborta inmediatamente
- **Falla creación de departamentos**: Rollback completo
- **Falla creación de usuario**: Rollback completo  
- **Falla inicialización de roles**: Rollback completo
- **Índice de departamento inválido**: Error manejado correctamente

### ✅ Verificación de No-Eventos
- Si la transacción falla, NO se emiten eventos
- No se realizan efectos secundarios en caso de error

## Impacto en la Aplicación

### Antes (❌ Problemático)
```
1. Crear compañía ✅
2. Crear algunos departamentos ✅  
3. Fallar en creación de usuario ❌
   └─ RESULTADO: Compañía creada pero sin usuario (INCONSISTENTE)
```

### Después (✅ Solucionado)
```
1. Validar NIT ✅
2. Crear compañía ✅
3. Crear departamentos ✅
4. Crear usuario ✅
5. Crear plan ✅
6. Crear créditos ✅
7. Crear roles ✅

Si cualquier paso falla → ROLLBACK COMPLETO
```

## Garantías de Consistencia

### 1. **Integridad Referencial**
- Todos los departamentos pertenecen a la compañía creada
- El usuario está asignado a un departamento válido
- Los roles están correctamente asignados al usuario
- Los créditos están inicializados para la compañía

### 2. **Estado Coherente**
- **Nunca** una compañía sin departamentos
- **Nunca** un usuario sin departamento asignado
- **Nunca** una compañía sin usuario administrador
- **Siempre** roles correctamente configurados

### 3. **Recuperación de Errores**
- Cualquier falla resulta en estado inicial (no signup)
- No hay cleanup manual necesario
- No hay datos huérfanos que limpiar

## Conclusión

El proceso de signup ahora es **completamente atómico** y garantiza:

- ✅ **ACID Compliance**: Atomicity, Consistency, Isolation, Durability
- ✅ **Rollback automático** en caso de cualquier error
- ✅ **Estado consistente** en todo momento
- ✅ **No datos huérfanos** nunca
- ✅ **Testing completo** de todos los escenarios
- ✅ **Clean Architecture** mantenida

La solución elimina por completo el problema de inconsistencia de datos en el signup y proporciona una base sólida para el crecimiento futuro de la aplicación. 