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
6. Si todo sale bien, el backend estará corriendo en [http://localhost:3000](http://localhost:3000)

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
   cd client
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
9. Levanta los servicios de base de datos y MinIO:
   ```bash
   docker compose up -d database
   docker compose up -d minio
   docker compose up -d migrate
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

---

¡Y listo! 🎉 El backend de Docma estará funcionando en tu entorno local.
