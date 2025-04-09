# 📦 Docma - Backend

Este es el backend de Docma, una aplicación de gestión documental multitenant. A continuación te explicamos cómo ejecutarlo localmente.

---

## 🚀 Requisitos

- Node.js 22.x
- [Docker + Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

---

## 🐳 Opción 1: Ejecutar con Docker

1. Asegúrate de tener Docker y Docker Compose instalados.
2. Abre la terminal y ubícate en el root del proyecto.
3. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
En Windows PowerShell:
```powershell
copy .env.example .env
```
4. Ejecuta el backend:

```bash
docker compose up
```

5. Si todo sale bien, el backend estará corriendo en http://localhost:3000

## 🧪 Opción 2: Ejecutar con pnpm
1. Instala Node.js 22 si no lo tienes.

2. Instala pnpm globalmente:

    ```bash
    npm install -g pnpm
    ```
3. Ubícate en el root del proyecto.

4. Instala las dependencias:

    ```bash
    pnpm install
    ```

5. Genera el cliente de Prisma:

    ```bash
    npx prisma generate
    ```

6. Asegúrate de tener Docker y Docker Compose instalados.

7. Levanta los servicios de base de datos y MinIO:

    ``` bash
    docker compose up -d database
    docker compose up -d minio
    ```
8. Inicia el proyecto:

    ```bash
    pnpm start:dev
    ```