# 🌐 Configurar subdominios wildcard en local

Este documento explica cómo trabajar con subdominios dinámicos (wildcard) en desarrollo local, útil para aplicaciones multitenant como Docma.

---

## 🧠 ¿Por qué subdominios wildcard?

Docma usa subdominios para separar los tenants. Ejemplo:
- `acme.localhost:3001`
- `globex.localhost:3001`

Esto permite simular entornos independientes por empresa o cliente durante el desarrollo.

---

## 🛠️ Requisitos

- Navegador moderno
- Servidor que acepte peticiones a `*.localhost` (como Vite)
- Sistema operativo compatible (Linux, macOS o Windows)

---

## ✅ Solución recomendada: usar `*.localhost`

Los navegadores modernos resuelven automáticamente subdominios bajo `.localhost` hacia `127.0.0.1`. Esto significa que no necesitas editar tu archivo `hosts`.

### Ejemplo de uso:

```bash
http://empresa1.localhost:3001
http://test123.localhost:3001
```

---

## ⚙️ Extra (opcional): Configurar `dnsmasq` o `vhost` personalizados

Esto es útil si deseas usar un dominio como `*.miapp.local`.

### En Linux/macOS:

1. Edita tu archivo `/etc/hosts`:
   ```bash
   127.0.0.1  empresa1.miapp.local empresa2.miapp.local
   ```

### En Windows:

1. Abre `Bloc de notas` como administrador.
2. Edita `C:\Windows\System32\drivers\etc\hosts`:
   ```plaintext
   127.0.0.1 empresa1.miapp.local
   ```

---
