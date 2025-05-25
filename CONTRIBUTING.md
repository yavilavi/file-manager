# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a **File Manager**! Esta guía te ayudará a entender cómo puedes participar en el desarrollo del proyecto respetando nuestros términos de licencia.

## 📋 Términos de Contribución

Al contribuir a este proyecto, aceptas que:

1. **Todas las contribuciones** deben hacerse al repositorio original
2. **Debes mantener la atribución** al autor original (Yilmer Avila) en todo momento
3. **No puedes** crear versiones modificadas independientes para distribución
4. **Tus contribuciones** se integrarán bajo la misma licencia Contribution-Only License (COL)
5. **Renuncias** a derechos exclusivos sobre tus contribuciones
6. **Las contribuciones** pueden ser utilizadas por los mantenedores del proyecto
7. **Cualquier uso** del código debe incluir atribución apropiada al autor original

## 🏷️ Requisito de Atribución

### **En todas las contribuciones debes:**
- ✅ Mantener comentarios de copyright existentes
- ✅ No remover atribuciones al autor original
- ✅ Agregar atribución en nuevos archivos según el template
- ✅ Incluir referencia al proyecto original en documentación

### **Template para nuevos archivos:**
```typescript
/**
 * File Manager - [File description]
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * * [Your Name] - [Date] - [Your prefered social media url]
 * * [Your constribution description]
 */
```

## 🚀 Cómo Contribuir

### 1. **Fork y Clone**
```bash
# Fork el repositorio en GitHub, luego clona tu fork
git clone https://github.com/tu-usuario/file-manager.git
cd file-manager

# Agrega el repositorio original como upstream
git remote add upstream https://github.com/original-repo/file-manager.git
```

### 2. **Configura tu Entorno**
```bash
# Instala las dependencias
pnpm install

# Configura el entorno de desarrollo
cp api/.env.example api/.env
# Edita las variables de entorno según sea necesario

# Levanta los servicios
docker-compose up -d
```

### 3. **Crea una Branch**
```bash
# Actualiza tu main branch
git checkout main
git pull upstream main

# Crea una nueva branch para tu feature/fix
git checkout -b feature/descripcion-corta
# o
git checkout -b fix/descripcion-del-bug
```

### 4. **Desarrolla tu Contribución**

#### **Tipos de Contribuciones Bienvenidas:**
- 🐛 **Bug fixes**
- ✨ **Nuevas características**
- 📝 **Mejoras en documentación**
- 🎨 **Mejoras en UI/UX**
- ⚡ **Optimizaciones de performance**
- 🔧 **Refactoring siguiendo Clean Architecture**
- 🧪 **Tests y coverage**

#### **Estándares de Código:**
- Sigue los principios **SOLID** y **Clean Architecture**
- Usa **TypeScript** con tipado estricto
- Implementa **tests unitarios** para nuevas funcionalidades
- Mantén **cobertura de tests > 80%**
- Sigue las convenciones de **ESLint** y **Prettier**
- Documenta funciones y clases complejas

### 5. **Commits y Testing**
```bash
# Ejecuta los tests antes de commit
pnpm test
pnpm test:e2e

# Asegúrate de que el linting pase
pnpm lint
pnpm format

# Haz commits descriptivos siguiendo Conventional Commits
git add .
git commit -m "feat: agregar validación de email en UserMapper"
# o
git commit -m "fix: corregir dependencia circular en AuthService"
```

### 6. **Pull Request**
```bash
# Push tu branch
git push origin feature/descripcion-corta

# Crea un Pull Request en GitHub
```

## 📝 Estándares para Pull Requests

### **Template de PR:**
```markdown
## 📋 Descripción
Descripción clara de los cambios realizados.

## 🔧 Tipo de cambio
- [ ] Bug fix (cambio que arregla un issue)
- [ ] Nueva característica (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que rompe compatibilidad)
- [ ] Documentación

## 🧪 Testing
- [ ] Tests unitarios agregados/actualizados
- [ ] Tests de integración agregados/actualizados
- [ ] Todos los tests pasan
- [ ] Cobertura > 80%

## 📋 Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado self-review de mi código
- [ ] He comentado mi código en partes complejas
- [ ] He actualizado la documentación
- [ ] No introduzco warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests unitarios y de integración pasan localmente
```

### **Criterios de Aceptación:**
- ✅ Código sigue principios SOLID y Clean Architecture
- ✅ Tests unitarios con > 80% coverage
- ✅ Documentación actualizada
- ✅ Sin errores de ESLint/TypeScript
- ✅ Performance no se degrada
- ✅ Compatible con arquitectura existente

## 🏗️ Arquitectura del Proyecto

### **Estructura de Módulos:**
```
api/src/modules/[modulo]/
├── domain/
│   ├── entities/      # Entidades de negocio
│   ├── repositories/  # Interfaces de repositorio
│   ├── services/      # Servicios de dominio
│   └── value-objects/ # Objetos de valor
├── application/
│   ├── use-cases/     # Casos de uso
│   └── dtos/          # DTOs de aplicación
└── infrastructure/
    ├── repositories/  # Implementaciones de repositorio
    └── mappers/       # Mappers de datos
```

### **Principios a Seguir:**
1. **Dependency Inversion**: Usa interfaces, no implementaciones concretas
2. **Single Responsibility**: Una clase, una responsabilidad
3. **Open/Closed**: Abierto para extensión, cerrado para modificación
4. **Interface Segregation**: Interfaces específicas, no monolíticas
5. **Liskov Substitution**: Implementaciones intercambiables

## 🚫 Contribuciones NO Permitidas

### **Prohibido:**
- ❌ Crear forks independientes para distribución
- ❌ Contribuciones con licencias incompatibles
- ❌ Código que viole derechos de autor
- ❌ Funcionalidades para comercializar el software
- ❌ Breaking changes sin discusión previa
- ❌ Código sin tests o documentación

### **Proceso de Rechazo:**
Si una contribución no cumple los estándares o términos:
1. Se proporcionará feedback constructivo
2. Se dará oportunidad de corrección
3. Se rechazará si no se corrige después de 2 iteraciones

## 🤔 ¿Tienes Preguntas?

- 📖 Lee la [documentación del proyecto](./docs/)
- 🐛 Revisa [issues existentes](../../issues)
- 💬 Abre una [discusión](../../discussions) para preguntas generales
- 📧 Contacta a los mantenedores para dudas sobre licenciamiento

## 🙏 Reconocimientos

Todas las contribuciones son valoradas y reconocidas. Los contribuyentes aparecerán en:
- Lista de colaboradores del repositorio
- Release notes cuando sus cambios sean incluidos
- Archivo AUTHORS.md (si se crea)

---

**Recuerda:** Al contribuir, ayudas a crear una herramienta mejor para toda la comunidad, manteniendo el proyecto libre y accesible bajo nuestros términos de licencia.

¡Gracias por contribuir! 🚀 