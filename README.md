# OPE — Proyecto Completo (Frontend Angular)

Sistema de Optimización de Energía para Flotas Inteligentes.

## Flujo de navegación

```
/ → /login → (autenticación) → /dashboard
              ↓
           /register → /login
```

## Estructura del proyecto

```
src/
├── assets/
│   └── ope-logo.png
├── app/
│   ├── app.component.ts          ← Root: solo <router-outlet>
│   ├── app.config.ts             ← provideRouter
│   ├── app.routes.ts             ← Todas las rutas unificadas
│   │
│   ├── auth/                     ── PÁGINAS PÚBLICAS
│   │   ├── login/                ← Login (redirige a /dashboard)
│   │   └── register/             ← Registro (redirige a /login)
│   │
│   ├── shared/
│   │   └── layout/               ← Shell: header + sidebar + <router-outlet>
│   │
│   ├── dashboard/                ── PÁGINAS PROTEGIDAS
│   ├── fleet-tracking/
│   ├── tracking-control/
│   ├── maintenance-requests/
│   ├── consumption-reports/
│   ├── driver-register/
│   ├── vehicle-register/
│   └── rentals/
└── styles.scss
```

## Rutas

| Ruta                    | Acceso   | Descripción                        |
|-------------------------|----------|------------------------------------|
| `/login`                | Público  | Página de inicio (default)         |
| `/register`             | Público  | Registro de usuario                |
| `/dashboard`            | App      | Dashboard con gráfica de consumo   |
| `/fleet-tracking`       | App      | Seguimiento de flota               |
| `/tracking-control`     | App      | Control de seguimiento             |
| `/maintenance-requests` | App      | Solicitudes de mantenimiento (CRUD)|
| `/consumption-reports`  | App      | Reportes de consumo                |
| `/driver-register`      | App      | Registro de conductores (CRUD)     |
| `/vehicle-register`     | App      | Registro de vehículos (CRUD)       |
| `/rentals`              | App      | Gestión de rentas (crear/finalizar)|

## Instalación

```bash
# Instalar dependencias
npm install

# Instalar Chart.js (requerido para el dashboard)
npm install chart.js

# Correr en desarrollo
ng serve
```

## Integración en tu repositorio

1. Copia toda la carpeta `src/app/` a tu proyecto
2. Copia `src/assets/ope-logo.png` a tu carpeta de assets
3. Reemplaza tu `src/app/app.routes.ts`, `app.component.ts` y `app.config.ts`
4. Copia `src/styles.scss` o fusiona con el tuyo
5. Instala Chart.js: `npm install chart.js`

## Autenticación

El login actualmente navega a `/dashboard` si usuario y contraseña no están vacíos.
Para conectar con tu backend, edita `onLogin()` en `auth/login/login.component.ts`:

```typescript
onLogin() {
  this.authService.login(this.usuario, this.contrasena).subscribe(() => {
    this.router.navigate(['/dashboard']);
  });
}
```
