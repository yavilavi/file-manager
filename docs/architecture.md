# Análisis de Arquitectura - Problemas Identificados

## Resumen Ejecutivo

Este documento identifica los módulos que requieren refactorización para cumplir con los principios de Clean Architecture, SOLID y DRY. Se han encontrado múltiples violaciones arquitecturales que comprometen la mantenibilidad, testabilidad y escalabilidad del sistema.

## Módulos que Requieren Ajustes Críticos

### 1. **AuthService** - Violaciones Múltiples de SOLID

**Archivo:** `src/modules/auth/auth.service.ts`

#### Problemas Identificados:

**🔴 Violación del Single Responsibility Principle (SRP)**
- El servicio maneja autenticación, autorización, registro de usuarios, creación de empresas, departamentos, planes y roles
- Responsabilidades mezcladas: validación, hashing de passwords, creación de entidades, transacciones de BD, eventos

**🔴 Violación del Dependency Inversion Principle (DIP)**
- Dependencia directa de `PrismaService` (infraestructura)
- Dependencia directa de `argon2` (detalle de implementación)
- Dependencia directa de `RoleInitializationService` de otro módulo

**🔴 Violación del Open/Closed Principle (OCP)**
- Método `signup()` de 80+ líneas con lógica hardcodeada
- Imposible extender sin modificar el código existente

**🔴 Violación de Clean Architecture**
- Lógica de dominio mezclada con infraestructura
- Transacciones de base de datos en la capa de aplicación
- Dependencias circulares entre módulos

#### Refactorización Requerida:
```typescript
// Separar en múltiples servicios:
- AuthenticationService (solo login/validación)
- UserRegistrationService (solo registro de usuarios)
- CompanyOnboardingService (proceso completo de registro)
- PasswordService (abstracción para hashing)
```

---

### 2. **UsersService** - Violaciones de DRY y SRP

**Archivo:** `src/modules/users/users.service.ts`

#### Problemas Identificados:

**🔴 Violación del DRY Principle**
- Código duplicado en `select` objects (aparece 4+ veces)
- Lógica de validación de email duplicada
- Transformaciones de datos repetidas

**🔴 Violación del Single Responsibility Principle**
- Maneja CRUD, validaciones, hashing de passwords, eventos, transformaciones
- Mezcla lógica de dominio con persistencia

**🔴 Violación de Clean Architecture**
- Dependencia directa de Prisma (infraestructura)
- Lógica de dominio en capa de aplicación

#### Código Problemático:
```typescript
// Este select se repite 4 veces en el archivo
select: {
  id: true,
  name: true,
  email: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  password: selectPassword,
  department: {
    select: {
      id: true,
      name: true,
    },
  },
  company: {
    select: {
      id: true,
      name: true,
      nit: true,
      tenantId: true,
    },
  },
}
```

#### Refactorización Requerida:
```typescript
// Crear abstracciones:
- UserRepository (interface + implementación)
- UserDomainService (validaciones de dominio)
- UserQueryBuilder (para selects reutilizables)
- UserMapper (transformaciones)
```

---

### 3. **RolesService** - Violaciones de Clean Architecture

**Archivo:** `src/modules/roles/roles.service.ts`

#### Problemas Identificados:

**🔴 Violación de Clean Architecture**
- Dependencia directa de Prisma en capa de aplicación
- Lógica de transformación de datos en servicio de aplicación
- No hay separación entre dominio e infraestructura

**🔴 Violación del Single Responsibility Principle**
- Maneja CRUD, transformaciones, validaciones y queries complejas
- Mezcla lógica de persistencia con lógica de negocio

**🔴 Código Duplicado**
- Transformaciones de `rolePermissions` repetidas múltiples veces
- Lógica de validación de existencia duplicada

#### Refactorización Requerida:
```typescript
// Implementar Clean Architecture:
- IRoleRepository (interface)
- RoleRepository (implementación Prisma)
- RoleDomainService (validaciones de dominio)
- RoleMapper (transformaciones)
```

---

### 4. **PermissionsService** - Antipatrón de Raw Queries

**Archivo:** `src/modules/permissions/permissions.service.ts`

#### Problemas Identificados:

**🔴 Antipatrón de Raw SQL**
- Uso excesivo de `$queryRaw` sin justificación
- Pérdida de type safety
- Vulnerabilidad potencial a SQL injection
- Dificulta testing y mantenimiento

**🔴 Violación del DRY Principle**
- Queries SQL repetitivas
- Lógica de conteo duplicada

#### Código Problemático:
```typescript
// Innecesario uso de raw SQL para operaciones simples
async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
  const result = await this.prisma.client.$queryRaw<Permission[]>`
    INSERT INTO "permission" ("id", "description", "createdAt", "updatedAt")
    VALUES (${createPermissionDto.id}, ${createPermissionDto.description}, NOW(), NOW())
    RETURNING *
  `;
  return result[0];
}
```

#### Refactorización Requerida:
```typescript
// Usar Prisma ORM apropiadamente:
async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
  return this.prisma.client.permission.create({
    data: {
      id: createPermissionDto.id,
      description: createPermissionDto.description,
    },
  });
}
```

---

### 5. **CreateTenantUseCase** - Violaciones de Clean Architecture

**Archivo:** `src/modules/tenant/application/use-cases/create-tenant.use-case.ts`

#### Problemas Identificados:

**🔴 Violación de Clean Architecture**
- Use case accede directamente a Prisma (infraestructura)
- Lógica de transacciones en capa de aplicación
- Dependencia directa de `argon2` (detalle de implementación)

**🔴 Violación del Single Responsibility Principle**
- Maneja validación, creación de tenant, usuario, roles y respuesta
- Mezcla múltiples responsabilidades en un solo método

**🔴 Violación del Dependency Inversion Principle**
- Dependencia directa de servicios de infraestructura
- No usa abstracciones para operaciones de BD

#### Refactorización Requerida:
```typescript
// Separar responsabilidades:
- TenantCreationService (solo creación de tenant)
- UserCreationService (solo creación de usuario)
- TransactionManager (abstracción para transacciones)
- PasswordHasher (abstracción para hashing)
```

---

### 6. **CompanyService** - Servicio Incompleto

**Archivo:** `src/modules/company/company.service.ts`

#### Problemas Identificados:

**🔴 Violación del Interface Segregation Principle**
- Servicio con una sola operación (create)
- No implementa operaciones CRUD completas
- Funcionalidad limitada para un servicio de dominio

**🔴 Violación de Clean Architecture**
- Dependencia directa de Prisma
- Lógica de validación mezclada con persistencia

#### Refactorización Requerida:
```typescript
// Completar el servicio:
- Implementar CRUD completo
- Crear CompanyRepository interface
- Separar validaciones de dominio
```

---

### 7. **CreditsService** - Dependencias Circulares

**Archivo:** `src/modules/credits/application/services/credits.service.ts`

#### Problemas Identificados:

**🔴 Dependencia Circular**
- Usa `forwardRef()` con `CompanyPlanService`
- Indica diseño arquitectural problemático
- Dificulta testing y mantenimiento

**🔴 Violación del Dependency Inversion Principle**
- Dependencia directa de servicios concretos
- No usa abstracciones/interfaces

**🔴 Manejo de Errores Inconsistente**
- Usa `console.warn()` en lugar de logging apropiado
- Manejo de errores silencioso con try/catch vacío

#### Refactorización Requerida:
```typescript
// Eliminar dependencia circular:
- Crear eventos de dominio para comunicación
- Usar interfaces para abstraer dependencias
- Implementar logging apropiado
```

---

## Problemas Transversales

### 1. **Falta de Abstracciones de Repositorio**

**Módulos Afectados:** Users, Roles, Permissions, Company, Auth

**Problema:** Dependencia directa de Prisma en servicios de aplicación

**Solución:**
```typescript
// Crear interfaces de repositorio:
interface IUserRepository {
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  save(user: User): Promise<User>;
  // ...
}
```

### 2. **Mezcla de Capas Arquitecturales**

**Problema:** Servicios de aplicación con lógica de infraestructura

**Solución:** Implementar Clean Architecture apropiadamente:
```
Domain/ (entities, value objects, interfaces)
Application/ (use cases, DTOs, interfaces)
Infrastructure/ (repositories, external services)
Presentation/ (controllers, DTOs)
```

### 3. **Falta de Mappers/Transformers**

**Problema:** Transformaciones de datos dispersas en servicios

**Solución:** Crear mappers dedicados:
```typescript
class UserMapper {
  static toDomain(prismaUser: PrismaUser): User { }
  static toDTO(user: User): UserDTO { }
  static toPersistence(user: User): PrismaUserData { }
}
```

### 4. **Inconsistencia en Manejo de Errores**

**Problema:** Diferentes estrategias de manejo de errores por módulo

**Solución:** Implementar estrategia unificada:
```typescript
// Crear excepciones de dominio específicas
class UserNotFoundError extends DomainError { }
class InvalidEmailError extends DomainError { }
```

## Prioridades de Refactorización

### 🔥 **Crítico (Inmediato)**
1. **AuthService** - Separar responsabilidades
2. **PermissionsService** - Eliminar raw queries
3. **CreditsService** - Resolver dependencia circular

### ⚠️ **Alto (Próximo Sprint)**
4. **UsersService** - Implementar repositorio y eliminar duplicación
5. **RolesService** - Aplicar Clean Architecture
6. **CreateTenantUseCase** - Separar responsabilidades

### 📋 **Medio (Backlog)**
7. **CompanyService** - Completar funcionalidad
8. Implementar mappers transversales
9. Unificar manejo de errores

## Métricas de Calidad Actuales

- **Complejidad Ciclomática:** Alta (>10 en múltiples métodos)
- **Acoplamiento:** Alto (dependencias directas entre módulos)
- **Cohesión:** Baja (múltiples responsabilidades por clase)
- **Cobertura de Tests:** No evaluada (requiere refactorización primero)

## Beneficios Esperados Post-Refactorización

1. **Mantenibilidad:** Código más fácil de modificar y extender
2. **Testabilidad:** Posibilidad de unit tests efectivos
3. **Escalabilidad:** Arquitectura preparada para crecimiento
4. **Legibilidad:** Código más claro y autodocumentado
5. **Reutilización:** Componentes reutilizables entre módulos 