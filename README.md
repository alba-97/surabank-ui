# SuraBank UI

Interfaz de usuario para la aplicación bancaria SuraBank.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Animaciones**: Framer Motion
- **HTTP**: Axios
- **Testing**: Jest + Testing Library

## Estructura

```
ui/
├── app/
│   ├── login/           # Página de login
│   ├── home/           # Dashboard (tarjetas, movimientos)
│   │   └── _components/
│   │       ├── CardCarousel.tsx
│   │       ├── Header.tsx
│   │       └── Movements.tsx
│   ├── cards/          # Gestión de tarjetas
│   │   └── _components/
│   │       ├── MoveBalance.tsx
│   │       └── NewCard.tsx
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Landing (redirect a login)
├── contexts/           # Contextos React (theme)
├── interfaces/         # Tipos TypeScript
├── public/             # Assets estáticos
│   ├── icons/          # Iconos SVG
│   └── sounds/         # Efectos de sonido
└── services/           # Cliente API
```

## Páginas

- `/` - Landing (redirige a login)
- `/login` - Inicio de sesión
- `/home` - Dashboard principal (tarjetas, movimientos)
- `/cards` - Gestión de tarjetas

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run start    # Servir producción
npm run lint     # Linter
npm run test    # Tests
```

## Configuración

La UI se comunica con la API en `http://localhost:8000/surabank`. Configurar la variable de entorno `NEXT_PUBLIC_API_URL` si es necesario.