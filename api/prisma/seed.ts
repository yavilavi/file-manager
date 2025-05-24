import {
  PrismaClient,
  Company,
  Department,
  Plan,
  Permission,
  Role,
  User,
  File,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Create 3 companies
  const companies: Company[] = [];
  for (let i = 1; i <= 3; i++) {
    const company = await prisma.company.upsert({
      where: { nit: `123456789-${i}` },
      update: {},
      create: {
        name: `Company ${i}`,
        nit: `123456789-${i}`,
        tenantId: `tenant${i}`,
        canSendEmail: i === 1,
      },
    });
    companies.push(company);
  }

  // Create 3 departments for each company
  const departments: Department[] = [];
  for (const company of companies) {
    for (let i = 1; i <= 3; i++) {
      const department = await prisma.department.upsert({
        where: {
          id: i + (parseInt(company.tenantId.replace('tenant', '')) - 1) * 3,
        },
        update: {},
        create: {
          name: `Department ${i} - ${company.name}`,
          tenantId: company.tenantId,
        },
      });
      departments.push(department);
    }
  }

  // Create 3 plans
  const plans: Plan[] = [];
  for (let i = 1; i <= 3; i++) {
    const plan = await prisma.plan.upsert({
      where: { name: `Plan ${i}` },
      update: {},
      create: {
        name: `Plan ${i}`,
        description: `Description for Plan ${i}`,
        storageSize: BigInt(1024 * 1024 * 1024 * i), // i GB in bytes
        isActive: true,
      },
    });
    plans.push(plan);
  }

  // Create company plans
  for (let i = 0; i < companies.length; i++) {
    await prisma.companyPlan.upsert({
      where: { tenantId: companies[i].tenantId },
      update: {},
      create: {
        tenantId: companies[i].tenantId,
        planId: plans[i % plans.length].id,
        isActive: true,
        storageUsed: BigInt(0),
      },
    });
  }

  // Create company credits
  for (const company of companies) {
    await prisma.companyCredits.upsert({
      where: { tenantId: company.tenantId },
      update: {},
      create: {
        tenantId: company.tenantId,
        totalPurchased: 100,
        currentBalance: 100,
      },
    });
  }

  // Create 3 permissions
  const permissions: Permission[] = [];
  const permissionTypes = ['files', 'users', 'roles'];
  const actions = ['read', 'write', 'delete'];

  for (let i = 0; i < 3; i++) {
    const permission = await prisma.permission.upsert({
      where: { id: `${permissionTypes[i]}:${actions[i]}` },
      update: {},
      create: {
        id: `${permissionTypes[i]}:${actions[i]}`,
        description: `Can ${actions[i]} ${permissionTypes[i]}`,
      },
    });
    permissions.push(permission);
  }

  // Create 3 roles for each company
  const roles: Role[] = [];
  for (const company of companies) {
    for (let i = 1; i <= 3; i++) {
      const role = await prisma.role.upsert({
        where: {
          id: i + (parseInt(company.tenantId.replace('tenant', '')) - 1) * 3,
        },
        update: {},
        create: {
          name: `Role ${i}`,
          description: `Description for Role ${i}`,
          tenantId: company.tenantId,
          isAdmin: i === 1,
        },
      });
      roles.push(role);
    }
  }

  // Create role permissions
  for (let i = 0; i < roles.length; i++) {
    for (let j = 0; j < permissions.length; j++) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roles[i].id,
            permissionId: permissions[j].id,
          },
        },
        update: {},
        create: {
          roleId: roles[i].id,
          permissionId: permissions[j].id,
        },
      });
    }
  }

  // Create 3 users for each company
  const users: User[] = [];
  for (const company of companies) {
    for (let i = 1; i <= 3; i++) {
      const hashedPassword = await argon2.hash(`password${i}`);
      const user = await prisma.user.upsert({
        where: {
          id: i + (parseInt(company.tenantId.replace('tenant', '')) - 1) * 3,
        },
        update: {},
        create: {
          name: `User ${i}`,
          email: `user${i}@${company.tenantId}.com`,
          password: hashedPassword,
          tenantId: company.tenantId,
          departmentId: departments.find(
            (d) =>
              d.tenantId === company.tenantId &&
              d.name.includes(`Department ${i}`),
          )?.id,
          isActive: true,
        },
      });
      users.push(user);
    }
  }

  // Create user roles
  for (let i = 0; i < users.length; i++) {
    const userRolesForCompany = roles.filter(
      (r) => r.tenantId === users[i].tenantId,
    );
    for (let j = 0; j < userRolesForCompany.length; j++) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: users[i].id,
            roleId: userRolesForCompany[j].id,
          },
        },
        update: {},
        create: {
          userId: users[i].id,
          roleId: userRolesForCompany[j].id,
        },
      });
    }
  }

  // Create 3 files for each user
  const files: File[] = [];
  for (const user of users) {
    for (let i = 1; i <= 3; i++) {
      const file = await prisma.file.create({
        data: {
          name: `File ${new Date().getTime()}`,
          extension: `.${['pdf', 'doc', 'txt'][i % 3]}`,
          mimeType: `application/${['pdf', 'msword', 'text'][i % 3]}`,
          hash: `hash_${user.id}_${i}`,
          size: 1024 * i,
          path: `/uploads/${user.tenantId}/${user.id}/file_${i}`,
          documentType: ['invoice', 'contract', 'report'][i % 3],
          tenantId: user.tenantId,
          userId: user.id,
        },
      });
      files.push(file);
    }
  }

  // Create 3 file versions for each file
  for (const file of files) {
    for (let i = 1; i <= 3; i++) {
      await prisma.fileVersion.create({
        data: {
          id: `version_${file.id}_${i}`,
          name: `Version ${i} of ${file.name}`,
          hash: `hash_${file.id}_v${i}`,
          size: file.size + i * 100,
          fileId: file.id,
          isLast: i === 3,
        },
      });
    }
  }

  // Create 3 email logs for each user
  for (const user of users) {
    for (let i = 1; i <= 3; i++) {
      await prisma.emailLog.create({
        data: {
          subject: `Email Subject ${i}`,
          recipients: [`recipient${i}@example.com`],
          creditsUsed: i,
          status: ['SENT', 'FAILED', 'PENDING'][i % 3],
          tenantId: user.tenantId,
          userId: user.id,
        },
      });
    }
  }

  // Create 3 credit transactions for each company
  for (const company of companies) {
    for (let i = 1; i <= 3; i++) {
      await prisma.creditTransaction.create({
        data: {
          transactionType: i % 2 === 0 ? 'PURCHASE' : 'USAGE',
          amount: i * 10,
          description: `Transaction ${i} for ${company.name}`,
          tenantId: company.tenantId,
          referenceId: i === 1 ? null : i,
        },
      });
    }
  }

  console.log('Database has been seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
