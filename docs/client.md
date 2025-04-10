# 🧾 Docma - Frontend

Este es el frontend de Docma, una aplicación de gestión documental multitenant construida como una SPA con React + Vite.

---

## 🚀 Requisitos

- Node.js 22.x
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

---

## ▶️ Cómo ejecutar en local

1. Abre una terminal y ubícate en la raíz del proyecto.
2. Entra a la carpeta del frontend:
   ```bash
   cd client
   ```
3. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
   En Windows PowerShell:
   ```powershell
   copy .env.example .env
   ```
4. Instala las dependencias:
   ```bash
   pnpm install
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
   Si quieres iniciar el servidor en modo producción, puedes usar:
   ```bash
    pnpm preview
    ```

6. La aplicación estará disponible en http://*.localhost:3001

   Ejemplo: [http://app.localhost:3001/signup](http://app.localhost:3001/signup)

---

## 🛠️ Stack Tecnológico

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Mantine UI](https://mantine.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)

---
