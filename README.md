# AGO Marketplace — Plataforma de Servicios Profesionales y Especializados

AGO Marketplace es una plataforma web integral diseñada para conectar a Solicitantes y Especialistas en Ecuador. Permite descubrir, cotizar, contratar y supervisar servicios técnicos y profesionales de manera segura con trazabilidad de punta a punta, mensajería en tiempo real y gestión de cobros en USD.

---

## 🚀 Características Principales

- **Diseño & Experiencia de Usuario**:
  - Tema moderno *Obsidian Dark* de alto contraste y legibilidad.
  - Tipografía refinada con *Plus Jakarta Sans* e iconografía coherente de *Lucide React*.
  - Navegación fluida y componentes modulares responsivos para móviles, tablets y escritorio.

- **Doble Rol de Usuario (Solicitante & Especialista)**:
  - Selector de modo dinámico con capacidades adaptativas sin necesidad de crear múltiples cuentas.
  - Perfil profesional con especialidad, portafolio de habilidades, tarifa por hora, años de experiencia y cobertura geográfica (por provincias y ciudades de Ecuador).

- **Catálogo y Búsqueda de Servicios**:
  - Filtro por categorías clave (Tecnología, Hogar y Mantenimiento, Negocios y Legal, Diseño y Multimedia, Salud y Bienestar, Eventos, etc.).
  - Búsqueda por palabras clave y filtro regional por provincias del Ecuador o modalidad 100% remota.

- **Gestión de Solicitudes y Propuestas**:
  - Publicación detallada de requerimientos de trabajo con rango de presupuesto en USD y fecha límite.
  - Envío de propuestas y cotizaciones formales por parte de especialistas verificados.
  - Aceptación de cotización que genera automáticamente un contrato de trabajo (*Job*) con custodia de alcance y cálculo transparente de comisiones.

- **Gestión de Contratos & Trabajos (*Jobs*)**:
  - Ciclo de vida completo: `funded` -> `in_progress` -> `delivered` -> `completed`.
  - Notas de entrega y confirmación de recepción.
  - Sistema de calificaciones y reseñas de 1 a 5 estrellas con cálculo automático del puntaje promedio y trabajos completados.

- **Mensajería Interna en Tiempo Real**:
  - Chat directo entre solicitantes y especialistas integrado con Firestore (`onSnapshot`).
  - Sin necesidad de compartir números telefónicos personales o salir de la plataforma.

- **Billetera y Control Financiero**:
  - Panel financiero para especialistas: balance disponible, balance pendiente y registro de transacciones.
  - Parámetros de comisión de plataforma transparentes.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, TypeScript, Vite
- **Estilos**: Tailwind CSS v4, Motion
- **Iconos**: Lucide React
- **Base de Datos & Autenticación**: Firebase Auth & Cloud Firestore
- **Seguridad**: Reglas de seguridad `firestore.rules` con modelo RBAC, validación estricta de esquemas e integridad de identidad.

---

## 📂 Estructura del Proyecto

```text
├── src/
│   ├── components/
│   │   ├── auth/          # Modales de autenticación y onboarding de perfil
│   │   ├── chat/          # Drawer de mensajería en tiempo real
│   │   ├── dashboard/     # Panel de control de Solicitante y Especialista
│   │   ├── home/          # Hero, Categorías, Destacados, Cómo Funciona, CTA
│   │   ├── layout/        # Navbar principal y Footer
│   │   ├── proposals/     # Modal de envío de cotizaciones y propuestas
│   │   ├── requests/      # Explorador y creación de requerimientos
│   │   ├── reviews/       # Calificaciones y retroalimentación de trabajos
│   │   ├── services/      # Catálogo, explorador y creación de servicios
│   │   └── specialists/   # Modal y tarjeta de perfil de especialista
│   ├── context/
│   │   └── AuthContext.tsx # Contexto central de sesión, perfil y roles
│   ├── lib/
│   │   ├── constants.ts   # Provincias, categorías fijas y configuración AGO
│   │   ├── dbService.ts   # Capa de abstracción de datos para Firestore
│   │   ├── firebase.ts    # Inicialización del SDK de Firebase
│   │   └── seedMarketplace.ts # Semilla inicial de datos de ejemplo
│   ├── types/
│   │   └── index.ts       # Tipos e interfaces de TypeScript
│   ├── App.tsx            # Orquestador de vistas y estado global
│   ├── main.tsx           # Punto de entrada de la aplicación
│   └── index.css          # Directivas globales de Tailwind CSS
├── firestore.rules        # Reglas de seguridad desplegadas en Firebase
├── firebase-applet-config.json # Configuración de conexión a Firebase
├── metadata.json          # Metadatos de la aplicación
└── package.json           # Dependencias y scripts de construcción
```

---

## ⚙️ Instalación y Ejecución Local

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o bun

### Pasos

1. **Clonar o descargar el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ago-marketplace
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

5. **Verificar tipado y sintaxis**:
   ```bash
   npm run lint
   ```

---

## 🔒 Reglas de Seguridad (Firestore)

El archivo `firestore.rules` ya está configurado y desplegado con las siguientes premisas:
- Los usuarios solo pueden modificar sus propios perfiles (`users/{uid}`).
- Las solicitudes y servicios son públicos para lectura, pero su creación y edición requieren autenticación.
- Las propuestas y contratos son accesibles únicamente por los participantes involucrados o el administrador (`agoserviplace@gmail.com`).
- La mensajería y calificaciones están protegidas por autoría e identidad cruzada.

---

## 📤 Subir a tu Repositorio de GitHub

El repositorio local ya está inicializado y listo. Para vincularlo a tu repositorio remoto en GitHub:

1. Crea un repositorio nuevo en GitHub (por ejemplo: `ago-marketplace`).
2. En la terminal de este proyecto, ejecuta:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

*(Nota: También puedes usar el menú de configuración de Google AI Studio para exportar directamente a GitHub si prefieres la integración con un solo clic).*

---

© 2026 AGO Marketplace. Todos los derechos reservados.
