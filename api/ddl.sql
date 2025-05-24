create database file_integity_manager;
create schema if not exists public;

create table public._prisma_migrations
(
  id                  varchar(36)                            not null
    primary key,
  checksum            varchar(64)                            not null,
  finished_at         timestamp with time zone,
  migration_name      varchar(255)                           not null,
  logs                text,
  rolled_back_at      timestamp with time zone,
  started_at          timestamp with time zone default now() not null,
  applied_steps_count integer                  default 0     not null
);

create table public.company
(
  id             serial
    primary key,
  name           varchar(255)                           not null,
  nit            varchar(255)                           not null,
  "tenantId"     varchar(15)                            not null,
  "createdAt"    timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt"    timestamp(3) default CURRENT_TIMESTAMP not null,
  "deletedAt"    timestamp(3),
  "canSendEmail" boolean      default false             not null
);

create unique index "uk_company_tenantId"
  on public.company ("tenantId");

create unique index company_nit_key
  on public.company (nit);

create table public.department
(
  id          serial
    primary key,
  name        varchar(255)                           not null,
  "tenantId"  varchar(15)                            not null
    references public.company ("tenantId")
      on update cascade on delete restrict,
  "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamp(3) default CURRENT_TIMESTAMP not null,
  "deletedAt" timestamp(3)
);

create unique index uk_department_name
  on public.department (name, "tenantId")
  where ("deletedAt" IS NULL);

create table public."user"
(
  id             serial
    primary key,
  name           varchar(30)                            not null,
  email          varchar(50)                            not null,
  password       varchar(255)                           not null,
  "tenantId"     varchar(15)                            not null
    references public.company ("tenantId")
      on update cascade on delete restrict,
  "departmentId" integer
                                                        references public.department
                                                          on update cascade on delete set null,
  "isActive"     boolean      default true              not null,
  "createdAt"    timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt"    timestamp(3) default CURRENT_TIMESTAMP not null,
  "deletedAt"    timestamp(3)
);

create table public.file
(
  id             serial
    primary key,
  name           varchar(255)                           not null,
  extension      varchar(20)                            not null,
  "mimeType"     varchar(150)                           not null,
  hash           varchar(255)                           not null,
  size           integer                                not null,
  path           varchar(255)                           not null,
  "documentType" varchar(50),
  "tenantId"     varchar(15)                            not null
    references public.company ("tenantId")
      on update cascade on delete restrict,
  "userId"       integer                                not null
    references public."user"
      on update cascade on delete restrict,
  "createdAt"    timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt"    timestamp(3) default CURRENT_TIMESTAMP not null,
  "deletedAt"    timestamp(3)
);

create unique index uk_file_name_tenant
  on public.file (name, "tenantId")
  where ("deletedAt" IS NULL);

create unique index uk_file_hash_tenant
  on public.file (hash, "tenantId")
  where ("deletedAt" IS NULL);

create table public.file_version
(
  id          varchar(255)                           not null
    primary key,
  name        varchar(255)                           not null,
  hash        varchar(255)                           not null,
  size        integer                                not null,
  "fileId"    integer                                not null
    references public.file
      on update cascade on delete restrict,
  "isLast"    boolean      default true              not null,
  "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamp(3) default CURRENT_TIMESTAMP not null,
  "deletedAt" timestamp(3)
);

create unique index uk_file_version_id
  on public.file_version (id);

create unique index uk_file_version_is_last
  on public.file_version ("fileId", "isLast")
  where ("deletedAt" IS NULL);

create unique index uk_user_email_company
  on public."user" (email, "tenantId")
  where ("deletedAt" IS NULL);

create table public.permission
(
  id          varchar(50)                            not null
    primary key,
  description varchar(255)                           not null,
  "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamp(3) default CURRENT_TIMESTAMP not null
);

create table public.role
(
  id          serial
    primary key,
  name        varchar(100)                           not null,
  description varchar(255),
  "tenantId"  varchar(15)                            not null
    references public.company ("tenantId")
      on update cascade on delete restrict,
  "isAdmin"   boolean      default false             not null,
  "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamp(3) default CURRENT_TIMESTAMP not null,
  "deletedAt" timestamp(3)
);

create unique index "role_tenantId_name_key"
  on public.role ("tenantId", name);

create table public.role_permission
(
  "roleId"       integer                                not null
    references public.role
      on update cascade on delete restrict,
  "permissionId" varchar(50)                            not null
    references public.permission
      on update cascade on delete restrict,
  "createdAt"    timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt"    timestamp(3) default CURRENT_TIMESTAMP not null,
  primary key ("roleId", "permissionId")
);

create table public.user_role
(
  "userId"    integer                                not null
    references public."user"
      on update cascade on delete restrict,
  "roleId"    integer                                not null
    references public.role
      on update cascade on delete restrict,
  "createdAt" timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt" timestamp(3) default CURRENT_TIMESTAMP not null,
  primary key ("userId", "roleId")
);

create table public.company_credits
(
  id               serial
    primary key,
  "tenantId"       varchar(15)                            not null
    references public.company ("tenantId")
      on update cascade on delete restrict,
  "totalPurchased" integer      default 0                 not null,
  "currentBalance" integer      default 0                 not null,
  "lastPurchaseAt" timestamp(3),
  "createdAt"      timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt"      timestamp(3) default CURRENT_TIMESTAMP not null
);

create unique index "company_credits_tenantId_key"
  on public.company_credits ("tenantId");

create table public.email_log
(
  id            serial
    primary key,
  subject       varchar(255)                           not null,
  recipients    text[],
  "creditsUsed" integer      default 1                 not null,
  status        varchar(50)                            not null,
  "tenantId"    varchar(15)                            not null
    references public.company ("tenantId")
      on update cascade on delete restrict,
  "userId"      integer                                not null
    references public."user"
      on update cascade on delete restrict,
  "createdAt"   timestamp(3) default CURRENT_TIMESTAMP not null
);

create table public.credit_transaction
(
  id                serial
    primary key,
  "transactionType" varchar(50)                            not null,
  amount            integer                                not null,
  description       varchar(255),
  "tenantId"        varchar(15)                            not null,
  "referenceId"     integer,
  "createdAt"       timestamp(3) default CURRENT_TIMESTAMP not null
);

create table public.plan
(
  id            serial
    primary key,
  name          varchar(100)                           not null,
  description   varchar(255)                           not null,
  "storageSize" bigint                                 not null,
  "isActive"    boolean      default true              not null,
  "createdAt"   timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt"   timestamp(3) default CURRENT_TIMESTAMP not null,
  "deletedAt"   timestamp(3)
);

create unique index plan_name_key
  on public.plan (name);

create table public.company_plan
(
  id            serial
    primary key,
  "tenantId"    varchar(15)                            not null
    references public.company ("tenantId")
      on update cascade on delete restrict,
  "planId"      integer                                not null
    references public.plan
      on update cascade on delete restrict,
  "startDate"   timestamp(3) default CURRENT_TIMESTAMP not null,
  "endDate"     timestamp(3),
  "isActive"    boolean      default true              not null,
  "storageUsed" bigint       default 0                 not null,
  "createdAt"   timestamp(3) default CURRENT_TIMESTAMP not null,
  "updatedAt"   timestamp(3) default CURRENT_TIMESTAMP not null
);

create unique index "company_plan_tenantId_key"
  on public.company_plan ("tenantId");
