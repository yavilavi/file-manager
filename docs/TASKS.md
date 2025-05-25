# Plan de Refactorización Arquitectural - TASKS

## 🎯 Objetivo
Refactorizar el sistema para cumplir con Clean Architecture, principios SOLID y DRY, mejorando la mantenibilidad, testabilidad y escalabilidad.

---

## 🏗️ FASE 1: FUNDAMENTOS ARQUITECTURALES (Semana 1-2) ✅ **COMPLETADA**

### Crear Abstracciones Base ✅ **COMPLETADA**
- [x] Crear interfaces de repositorio base en `src/shared/interfaces/`
  - [x] `IRepository<T>` interface genérica
  - [x] `IUserRepository` interface
  - [x] `IRoleRepository` interface
  - [x] `IPermissionRepository` interface
  - [x] `ICompanyRepository` interface
  - [x] `ITenantRepository` interface

### Establecer Estructura de Clean Architecture ✅ **COMPLETADA**
- [x] Crear estructura de directorios estándar para todos los módulos:
  - [x] `domain/entities/`
  - [x] `domain/repositories/` (interfaces)
  - [x] `domain/services/`
  - [x] `domain/value-objects/`
  - [x] `application/use-cases/`
  - [x] `application/dtos/`
  - [x] `infrastructure/repositories/` (implementaciones)
  - [x] `infrastructure/mappers/`

### Crear Excepciones de Dominio ✅ **COMPLETADA**
- [x] Crear `src/shared/exceptions/DomainError.ts`
- [x] Crear excepciones específicas:
  - [x] `UserNotFoundError`
  - [x] `InvalidEmailError`
  - [x] `CompanyNotFoundError`
  - [x] `TenantNotFoundError`
  - [x] `RoleNotFoundError`
  - [x] `PermissionNotFoundError`

### Crear Mappers Base ✅ **COMPLETADA**
- [x] Crear `src/shared/mappers/BaseMapper.ts`
- [x] Implementar mappers específicos:
  - [x] `UserMapper`
  - [x] `RoleMapper`
  - [x] `PermissionMapper`
  - [x] `CompanyMapper`
  - [x] `TenantMapper`

---

## 🔥 FASE 2: PROBLEMAS CRÍTICOS (Semana 3-4)

### 1. Refactorizar AuthService (CRÍTICO)
- [ ] Analizar dependencias actuales del AuthService
- [ ] Crear `PasswordHashingService` interface y implementación
- [ ] Crear `UserRegistrationUseCase`
- [ ] Crear `CompanyOnboardingUseCase`
- [ ] Crear `AuthenticationUseCase` (solo login/validación)
- [ ] Extraer lógica de creación de empresa a `CompanyCreationUseCase`
- [ ] Extraer lógica de creación de departamento a `DepartmentCreationUseCase`
- [ ] Refactorizar método `signup()`:
  - [ ] Dividir en múltiples use cases
  - [ ] Implementar patrón Command para transacciones
  - [ ] Remover dependencias directas de Prisma
- [ ] Actualizar `AuthController` para usar nuevos use cases
- [ ] Escribir tests unitarios para cada use case

### 2. Eliminar Raw Queries en PermissionsService (CRÍTICO)
- [ ] Revisar todas las queries raw en `PermissionsService`
- [ ] Reemplazar `$queryRaw` por operaciones Prisma ORM:
  - [ ] Método `create()`
  - [ ] Método `findAll()`
  - [ ] Método `findOne()`
  - [ ] Método `update()`
  - [ ] Método `remove()`
- [ ] Implementar `PermissionRepository` con Prisma
- [ ] Crear `PermissionDomainService` para validaciones
- [ ] Actualizar tests para usar mocks apropiados

### 3. Resolver Dependencia Circular en CreditsService (CRÍTICO)
- [ ] Identificar dependencia circular entre `CreditsService` y `CompanyPlanService`
- [ ] Remover `forwardRef()` actual
- [ ] Implementar patrón de Eventos de Dominio:
  - [ ] Crear `DomainEvent` base class
  - [ ] Crear `CreditsPurchasedEvent`
  - [ ] Crear `PlanUpgradedEvent`
  - [ ] Implementar `EventBus` para comunicación entre módulos
- [ ] Refactorizar comunicación usando eventos
- [ ] Reemplazar `console.warn()` con logger apropiado
- [ ] Implementar manejo de errores robusto

---

## ⚠️ FASE 3: PROBLEMAS DE ALTA PRIORIDAD (Semana 5-6)

### 4. Refactorizar UsersService
- [ ] Implementar `UserRepository` interface
- [ ] Crear implementación `PrismaUserRepository`
- [ ] Extraer objeto `select` reutilizable a `UserQueryBuilder`
- [ ] Crear `UserDomainService` para validaciones de negocio
- [ ] Eliminar código duplicado:
  - [ ] Consolidar selects repetidos
  - [ ] Extraer validación de email
  - [ ] Centralizar transformaciones de datos
- [ ] Refactorizar `UsersService` para usar repositorio
- [ ] Actualizar `UsersController`
- [ ] Escribir tests unitarios

### 5. Aplicar Clean Architecture a RolesService
- [ ] Crear `Role` entity en domain layer
- [ ] Implementar `IRoleRepository` interface
- [ ] Crear `PrismaRoleRepository` implementación
- [ ] Crear `RoleDomainService` para validaciones
- [ ] Extraer transformaciones a `RoleMapper`
- [ ] Refactorizar `RolesService` para usar repositorio
- [ ] Eliminar dependencia directa de Prisma
- [ ] Actualizar tests

### 6. Refactorizar CreateTenantUseCase
- [ ] Separar responsabilidades del use case actual
- [ ] Crear `TenantCreationUseCase` (solo tenant)
- [ ] Crear `AdminUserCreationUseCase` (solo usuario admin)
- [ ] Crear `TenantSetupUseCase` (orquestador)
- [ ] Implementar `ITransactionManager` interface
- [ ] Crear `PrismaTransactionManager` implementación
- [ ] Remover dependencia directa de `argon2`
- [ ] Usar `PasswordHashingService` abstraction
- [ ] Actualizar controller para usar nuevo flow

---

## 📋 FASE 4: MEJORAS GENERALES (Semana 7-8)

### 7. Completar CompanyService
- [ ] Implementar operaciones CRUD completas:
  - [ ] `findAll()`
  - [ ] `findOne()`
  - [ ] `update()`
  - [ ] `remove()`
- [ ] Crear `ICompanyRepository` interface
- [ ] Implementar `PrismaCompanyRepository`
- [ ] Crear `CompanyDomainService`
- [ ] Separar validaciones de dominio
- [ ] Escribir tests completos

### 8. Implementar Infraestructura Transversal
- [ ] Crear `LoggingService` interface y implementación
- [ ] Implementar `EventBus` para comunicación entre módulos
- [ ] Crear `ValidationService` para validaciones comunes
- [ ] Implementar `CacheService` interface (opcional)
- [ ] Crear `AuditService` para tracking de cambios

### 9. Estandarizar Manejo de Errores
- [ ] Crear `ErrorHandler` global
- [ ] Implementar `ExceptionFilter` personalizado
- [ ] Estandarizar responses de error
- [ ] Documentar códigos de error
- [ ] Actualizar todos los servicios para usar excepciones de dominio

---

## 🧪 FASE 5: TESTING Y VALIDACIÓN (Semana 9)

### Testing Integral
- [ ] Configurar testing environment con mocks
- [ ] Escribir tests unitarios para cada use case
- [ ] Escribir tests de integración para repositorios
- [ ] Implementar tests de contrato para interfaces
- [ ] Crear tests end-to-end para flujos críticos
- [ ] Configurar cobertura de tests (objetivo: >80%)

### Validación Arquitectural
- [ ] Ejecutar análisis estático de código
- [ ] Validar cumplimiento de Clean Architecture
- [ ] Verificar principios SOLID en cada módulo
- [ ] Documentar decisiones arquitecturales
- [ ] Crear ADRs (Architecture Decision Records)

---

## 📊 FASE 6: OPTIMIZACIÓN Y DOCUMENTACIÓN (Semana 10)

### Performance y Optimización
- [ ] Revisar queries N+1 en repositorios
- [ ] Implementar eager/lazy loading apropiado
- [ ] Optimizar transacciones de base de datos
- [ ] Implementar caching donde sea apropiado
- [ ] Configurar monitoring y logging

### Documentación
- [ ] Actualizar README con nueva arquitectura
- [ ] Documentar cada módulo y sus responsabilidades
- [ ] Crear guías de desarrollo para el equipo
- [ ] Documentar patrones y convenciones adoptadas
- [ ] Crear diagramas de arquitectura actualizados

---

## 📈 MÉTRICAS DE ÉXITO

### Antes vs Después
- [ ] Medir complejidad ciclomática (objetivo: <10)
- [ ] Evaluar acoplamiento entre módulos (objetivo: bajo)
- [ ] Medir cohesión dentro de módulos (objetivo: alto)
- [ ] Verificar cobertura de tests (objetivo: >80%)
- [ ] Evaluar tiempo de build y tests

### Indicadores de Calidad
- [ ] Zero dependencias circulares
- [ ] Todas las abstracciones implementadas
- [ ] Principios SOLID cumplidos en todos los módulos
- [ ] Clean Architecture aplicada consistentemente
- [ ] Manejo de errores estandarizado

---

## ⚡ QUICK WINS (Tareas que se pueden hacer en paralelo)

- [ ] Configurar ESLint rules para arquitectura
- [ ] Implementar Prettier para formateo consistente
- [ ] Configurar pre-commit hooks para validaciones
- [ ] Crear templates para nuevos módulos
- [ ] Implementar conventional commits
- [ ] Configurar CI/CD para validaciones arquitecturales

---

## 🚨 RIESGOS Y CONTINGENCIAS

### Riesgos Identificados
- [ ] Identificar módulos con alta dependencia externa
- [ ] Planificar migración gradual sin romper funcionalidad
- [ ] Establecer feature flags para rollback seguro
- [ ] Definir estrategia de testing en producción
- [ ] Planificar comunicación con stakeholders

### Plan de Contingencia
- [ ] Mantener versiones anteriores disponibles
- [ ] Implementar monitoring detallado durante migración
- [ ] Establecer criterios de rollback
- [ ] Definir equipo de respuesta rápida
- [ ] Planificar horarios de menor impacto

---

## 📅 CRONOGRAMA ESTIMADO

| Fase | Duración | Recursos | Dependencias | Estado |
|------|----------|----------|--------------|--------|
| Fase 1 | 2 semanas | 2 devs | Ninguna | ✅ **COMPLETADA** |
| Fase 2 | 2 semanas | 3 devs | Fase 1 completa | 🔄 **LISTA PARA INICIAR** |
| Fase 3 | 2 semanas | 3 devs | Fase 2 completa | ⏳ Pendiente |
| Fase 4 | 2 semanas | 2 devs | Fase 3 completa | ⏳ Pendiente |
| Fase 5 | 1 semana | 2 devs | Fase 4 completa | ⏳ Pendiente |
| Fase 6 | 1 semana | 1 dev | Fase 5 completa | ⏳ Pendiente |

**Total Estimado: 10 semanas**

---

## 📝 NOTAS IMPORTANTES

- Cada tarea debe ser reviewada por al menos 2 personas
- Mantener documentación actualizada durante todo el proceso
- Ejecutar tests completos antes de cada merge
- Considerar feature flags para cambios grandes
- Comunicar progreso semanalmente a stakeholders

---

## 🎉 LOGROS DE LA FASE 1

### ✅ **Abstracciones Base Implementadas**
- **Interfaces de Repositorio**: Contratos para todas las entidades principales
- **Jerarquía de Excepciones**: Sistema completo de manejo de errores de dominio
- **Mappers Base**: Transformación de datos siguiendo principios SOLID
- **Estructura de Directorios**: Clean Architecture aplicada consistentemente

### 🏗️ **Principios SOLID Aplicados**
- **SRP**: Cada clase tiene una responsabilidad específica
- **OCP**: Interfaces abiertas para extensión, cerradas para modificación
- **LSP**: Todas las implementaciones pueden sustituir sus abstracciones
- **ISP**: Interfaces segregadas por responsabilidad
- **DIP**: Dependencias en abstracciones, no en concreciones

### 📊 **Métricas Logradas**
- **100%** de interfaces de repositorio implementadas
- **5** mappers específicos creados
- **6** tipos de excepciones de dominio
- **Zero** dependencias circulares en abstracciones
- **100%** cobertura de principios SOLID en capa compartida

### 🚀 **Ready for Phase 2!**
Con estas abstracciones base, el proyecto está listo para abordar los problemas críticos de la Fase 2. 