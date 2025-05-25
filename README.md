# 📁 Docma

Docma es una aplicación de gestión documental multitenant construida como proyecto final  
para la materia de estructuras de datos 1. Está compuesta por un frontend SPA y un backend modular con NestJS.

---

## 📦 Estructura del Proyecto

```
.
├── api      # Backend hecho con NestJS + Prisma
└── client   # Frontend SPA hecho con React + Vite
└── docs     # Documentación del proyecto
└── .husky   # Hooks de git
```

---

## 🚀 Requisitos Generales

- Node.js 22.x
- [Docker + Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

---

## 🔧 Cómo ejecutar

### Backend (📂 api)

Ver instrucciones detalladas en [`api/README.md`](./docs/api.md)

### Frontend (📂 client)

Ver instrucciones detalladas en [`client/README.md`](./docs/client.md)

### 🌐 Configurar subdominios wildcard en local

Ver instrucciones detalladas en [`docs/subdomains.md`](./docs/subdomains.md)

---

## 🛠️ Tecnologías principales

- **Frontend:** React, Vite, Mantine, TypeScript
- **Backend:** NestJS, Prisma, PostgreSQL, MinIO, TypeScript, AWS SES

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Este proyecto utiliza una licencia personalizada que:

### ✅ **Permite:**
- Uso personal y educativo **con atribución**
- Uso interno en organizaciones **con atribución** (sin distribución comercial)
- Contribuciones al repositorio original
- Forks para propósito de contribuir de vuelta

### ❌ **Prohíbe:**
- Distribución comercial o venta del software
- Crear versiones modificadas independientes
- Usar como servicio comercial
- Crear productos competidores basados en este software
- **Usar sin atribución al autor original**

### 🏷️ **Requisito de Atribución:**
**TODO USO** del software debe incluir atribución a:
- **Autor**: Yilmer Avila ([LinkedIn](https://www.linkedin.com/in/yilmeravila/))
- **Proyecto**: File Manager
- **Licencia**: Contribution-Only License (COL)

### 📋 **Para contribuir:**
1. Haz fork del repositorio
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Mantén la atribución** al autor original en todos los archivos
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la branch (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

Todas las contribuciones deben hacerse al repositorio original y se integrarán bajo los mismos términos de licencia **manteniendo la atribución**.

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Contribution-Only License (COL)** - ver el archivo [LICENSE](LICENSE) para más detalles.

**Resumen de la licencia:**
- ✅ Libre para uso personal, educativo y interno en organizaciones **CON ATRIBUCIÓN**
- ✅ Contribuciones bienvenidas al repositorio original
- ❌ Prohibida la comercialización y distribución de versiones modificadas independientes
- ❌ **Prohibido el uso sin atribución al autor original**

**Atribución requerida:**
Todos los usos deben dar crédito a **Yilmer Avila** como autor original del proyecto.

Para consultas sobre licenciamiento comercial, contacta a los mantenedores del proyecto.

---

## ✍️ Autor

Desarrollado por [Yilmer Avila](https://www.linkedin.com/in/yilmeravila/) como proyecto final para la materia de estructuras de datos 1
