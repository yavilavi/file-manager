/**
 * File Manager - Permissions Seed
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { PrismaClient, Permission } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPermissions() {
  console.log('ðŸŒ± Seeding permissions...');

  const permissionData = [
    // File permissions
    { id: 'file:create', description: 'Crear archivos' },
    { id: 'file:read', description: 'Leer archivos' },
    { id: 'file:update', description: 'Actualizar archivos' },
    { id: 'file:delete', description: 'Eliminar archivos' },
    { id: 'file:download', description: 'Descargar archivos' },
    
    // User permissions
    { id: 'user:create', description: 'Crear usuarios' },
    { id: 'user:read', description: 'Leer usuarios' },
    { id: 'user:update', description: 'Actualizar usuarios' },
    { id: 'user:delete', description: 'Eliminar usuarios' },
    { id: 'user:toggle-status', description: 'Cambiar estado de usuarios' },
    
    // Department permissions
    { id: 'department:create', description: 'Crear departamentos' },
    { id: 'department:read', description: 'Leer departamentos' },
    { id: 'department:update', description: 'Actualizar departamentos' },
    { id: 'department:delete', description: 'Eliminar departamentos' },
    
    // Role permissions
    { id: 'role:create', description: 'Crear roles' },
    { id: 'role:read', description: 'Leer roles' },
    { id: 'role:update', description: 'Actualizar roles' },
    { id: 'role:delete', description: 'Eliminar roles' },
    
    // Permission permissions
    { id: 'permission:create', description: 'Crear permisos' },
    { id: 'permission:read', description: 'Leer permisos' },
    { id: 'permission:update', description: 'Actualizar permisos' },
    { id: 'permission:delete', description: 'Eliminar permisos' },
    
    // Notification permissions
    { id: 'notification:send', description: 'Enviar notificaciones' },
    
    // Credit permissions
    { id: 'credit:read', description: 'Leer crÃ©ditos' },
    { id: 'credit:purchase', description: 'Comprar crÃ©ditos' },
    { id: 'credit:use', description: 'Usar crÃ©ditos' },
    
    // Plan permissions
    { id: 'plan:create', description: 'Crear planes' },
    { id: 'plan:read', description: 'Leer planes' },
    { id: 'plan:update', description: 'Actualizar planes' },
    { id: 'plan:delete', description: 'Eliminar planes' },
    
    // Company Plan permissions
    { id: 'company-plan:create', description: 'Crear planes de empresa' },
    { id: 'company-plan:read', description: 'Leer planes de empresa' },
    { id: 'company-plan:update', description: 'Actualizar planes de empresa' },
    { id: 'company-plan:delete', description: 'Eliminar planes de empresa' },
    
    // Tenant permissions
    { id: 'tenant:read', description: 'Leer informaciÃ³n del tenant' },
  ];

  const permissions: Permission[] = [];

  for (const permData of permissionData) {
    try {
      const permission = await prisma.permission.upsert({
        where: { id: permData.id },
        update: {
          description: permData.description,
        },
        create: {
          id: permData.id,
          description: permData.description,
        },
      });
      permissions.push(permission);
      console.log(`âœ… Permission created/updated: ${permission.id}`);
    } catch (error) {
      console.error(`âŒ Error creating permission ${permData.id}:`, error);
    }
  }

  console.log(`ðŸŽ‰ Successfully seeded ${permissions.length} permissions!`);
  
  // Optionally, assign all permissions to admin roles
  console.log('ðŸ”§ Assigning permissions to admin roles...');
  
  try {
    const adminRoles = await prisma.role.findMany({
      where: { isAdmin: true },
    });

    for (const role of adminRoles) {
      for (const permission of permissions) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
      console.log(`âœ… Assigned all permissions to admin role: ${role.name} (ID: ${role.id})`);
    }
  } catch (error) {
    console.error('âŒ Error assigning permissions to admin roles:', error);
  }

  return permissions;
}

async function main() {
  try {
    await seedPermissions();
  } catch (error) {
    console.error('âŒ Error during permission seeding:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('ðŸ”Œ Database connection closed');
  })
  .catch(async (e) => {
    console.error('ðŸ’¥ Fatal error:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 