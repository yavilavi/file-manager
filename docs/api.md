# 📦 Docma - Backend
Vamos a ejecutar el backend de Docma, que está construido con Node.js y Prisma.

---

## 🚀 Requisitos

- Node.js 22.x
- [Docker + Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

---

## ▶️ Cómo ejecutar en local

### 🐳 Opción 1: Ejecutar con Docker Compose

1. Asegúrate de tener Docker y Docker Compose instalados.  
2. Abre la terminal y ubícate en el root del proyecto.
3. luego ubícate en la carpeta del backend
   ```bash
   cd api
   ```
4. Copia el archivo de variables de entorno:   
   
   #### En Linux o Mac:
   ```bash
   cp .env.example .env
   ```
   #### En Windows PowerShell:
   ```powershell
   copy .env.example .env
   ```
5. Ejecuta el backend:
   ```bash
   docker compose up -d
   ```
6. Si todo sale bien, el backend estará corriendo en http://*.localhost:3000

   Ejemplo: [http://empresa1.localhost:3000](http://empresa1.localhost:3000)

---

### 🧪 Opción 2: Ejecutar con pnpm

1. Instala Node.js 22 si no lo tienes.
2. Instala pnpm globalmente:
   ```bash
   npm install -g pnpm
   ```
3. Ubícate en el root del proyecto.
4. luego ubícate en la carpeta del backend
   ```bash
   cd api
   ```
5. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
   En Windows PowerShell:
   ```powershell
   copy .env.example .env
   ```
6. Instala las dependencias:
   ```bash
   pnpm install
   ```
7. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
8. Asegúrate de tener Docker y Docker Compose instalados.
9. Levanta los servicios de base de datos, onlyoffice y MinIO:
   ```bash
   docker compose up -d database
   docker compose up -d minio
   docker compose up -d migrate
   docker compose up -d onlyoffice
   ```
10. Ejecuta las migraciones para crear todas las tablas necesarias en la base de datos:
    ```bash
    npx prisma migrate dev
    ```
11. Inicia el proyecto:

    Para recargar automáticamente los cambios en el código, ejecuta:
    ```bash
    pnpm start:dev
    ```
    O para iniciar el proyecto sin recarga automática:
    ```bash
    pnpm start
    ```

## 🔧 Configurar envío de correos 

### ✉️ Con AWS SES

La aplicación usa AWS SES para enviar correos (por ejemplo, Bienvenida y permitir envío de correo manual). Para configurarlo:

1. Debes tener una cuenta activa en AWS
2. Ve a la consola de AWS SES y crea una identidad verificada (email o dominio).
3. Genera una Access Key y Secret Access Key desde IAM para un usuario con permisos sobre SES.
4. Agrega las siguientes variables en tu archivo `.env`:
   ```env
    EMAIL_FROM=ejemplo@mail.com
    AWS_ACCESS_KEY_ID=<TU_ACCESS_KEY>
    AWS_SECRET_ACCESS_KEY=<TU_SECRET_KEY>
    AWS_REGION=us-east-1
   ```
5. Asegúrate de que el correo esté verificado y autorizado para enviar desde SES.

### ✉️ Con SMTP

La funcionalidad de envío de correo usando protocolo SMTP está en construcción.

---
