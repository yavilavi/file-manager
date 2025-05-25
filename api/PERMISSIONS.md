# Sistema de Permisos

Este documento describe el sistema de permisos implementado en la aplicación.

## Estructura de Permisos

Los permisos siguen el formato `<recurso>:<acción>`, donde:
- `recurso`: El módulo o entidad sobre la que se actúa
- `acción`: La operación que se puede realizar

## Permisos Disponibles

### Archivos (Files)
- `file:create` - Crear archivos
- `file:read` - Leer archivos
- `file:update` - Actualizar archivos
- `file:delete` - Eliminar archivos
- `file:download` - Descargar archivos

### Usuarios (Users)
- `user:create` - Crear usuarios
- `user:read` - Leer usuarios
- `user:update` - Actualizar usuarios
- `user:delete` - Eliminar usuarios
- `user:toggle-status` - Cambiar estado de usuarios

### Departamentos (Departments)
- `department:create` - Crear departamentos
- `department:read` - Leer departamentos
- `department:update` - Actualizar departamentos
- `department:delete` - Eliminar departamentos

### Roles
- `role:create` - Crear roles
- `role:read` - Leer roles
- `role:update` - Actualizar roles
- `role:delete` - Eliminar roles

### Permisos (Permissions)
- `permission:create` - Crear permisos
- `permission:read` - Leer permisos
- `permission:update` - Actualizar permisos
- `permission:delete` - Eliminar permisos

### Notificaciones (Notifications)
- `notification:send` - Enviar notificaciones

### Créditos (Credits)
- `credit:read` - Leer créditos
- `credit:purchase` - Comprar créditos
- `credit:use` - Usar créditos

### Planes (Plans)
- `plan:create` - Crear planes
- `plan:read` - Leer planes
- `plan:update` - Actualizar planes
- `plan:delete` - Eliminar planes

### Planes de Empresa (Company Plans)
- `company-plan:create` - Crear planes de empresa
- `company-plan:read` - Leer planes de empresa
- `company-plan:update` - Actualizar planes de empresa
- `company-plan:delete` - Eliminar planes de empresa

### Tenants
- `tenant:read` - Leer información del tenant

## Uso en Controladores

Para proteger un endpoint con permisos, usa el decorador `@RequirePermission`:

```typescript
import { RequirePermission } from '@modules/auth/decorators/require-permission.decorator';

@Controller('files')
export class FilesController {
  @Get()
  @RequiredPermission('file:read')
  async getAllFiles() {
    // Lógica del endpoint
  }

  @Post()
  @RequiredPermission('file:create')
  async createFile() {
    // Lógica del endpoint
  }
}
```

## Roles de Administrador

Los usuarios con roles que tienen `isAdmin: true` automáticamente tienen acceso a todos los permisos, sin necesidad de asignarlos explícitamente.

## Seeder de Permisos

Para agregar todos los permisos a la base de datos, ejecuta:

```bash
npm run seed:permissions
```

Este comando:
1. Crea todos los permisos definidos en el sistema
2. Asigna automáticamente todos los permisos a los roles de administrador existentes

## Estructura de Base de Datos

### Tabla `permission`
- `id` (VARCHAR): Identificador único del permiso (formato: recurso:acción)
- `description` (VARCHAR): Descripción legible del permiso
- `createdAt` (TIMESTAMP): Fecha de creación
- `updatedAt` (TIMESTAMP): Fecha de última actualización

### Tabla `role_permission`
- `roleId` (INT): ID del rol
- `permissionId` (VARCHAR): ID del permiso
- Relación muchos a muchos entre roles y permisos

### Tabla `user_role`
- `userId` (INT): ID del usuario
- `roleId` (INT): ID del rol
- Relación muchos a muchos entre usuarios y roles

## Flujo de Autorización

1. El usuario hace una petición a un endpoint protegido
2. El `PermissionGuard` verifica si el endpoint requiere permisos
3. Si requiere permisos, extrae el usuario y tenant de la petición
4. Verifica si el usuario tiene un rol de administrador (acceso total)
5. Si no es admin, verifica si tiene el permiso específico requerido
6. Permite o deniega el acceso basado en la verificación

## Agregar Nuevos Permisos

1. Define el nuevo permiso en `api/prisma/permissions-seed.ts`
2. Ejecuta el seeder: `npm run seed:permissions`
3. Usa el decorador `@RequirePermission` en los endpoints correspondientes

## Endpoints Públicos

Para endpoints que no requieren autenticación, usa el decorador `@IsPublic()`:

```typescript
@Get('public-endpoint')
@IsPublic()
async publicEndpoint() {
  // Este endpoint no requiere autenticación ni permisos
}
``` 
