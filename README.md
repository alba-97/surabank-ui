# SuraBank UI

User interface for the SuraBank banking application.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Animations**: Framer Motion
- **HTTP**: Axios
- **Sound**: Howler.js
- **Testing**: Jest + Testing Library

## Structure

```
ui/
├── app/
│   ├── login/           # Login page
│   ├── home/           # Dashboard (cards, movements)
│   │   └── _components/
│   │       ├── CardCarousel.tsx
│   │       ├── Header.tsx
│   │       └── Movements.tsx
│   ├── cards/          # Card management
│   │   └── _components/
│   │       ├── MoveBalance.tsx
│   │       └── NewCard.tsx
│   ├── layout.tsx      # Main layout
│   └── page.tsx        # Landing (redirects to login)
├── contexts/           # React contexts (theme)
├── interfaces/         # TypeScript types
├── public/             # Static assets
│   ├── icons/          # SVG icons
│   └── sounds/         # Sound effects
└── services/           # API client
```

## Pages

- `/` - Landing (redirects to login)
- `/login` - Login page
- `/home` - Main dashboard (cards, movements)
- `/cards` - Card management

## Scripts

```bash
npm run dev      # Development
npm run build    # Production build
npm run start    # Serve production
npm run lint     # Linter
npm run test    # Tests
```

## Configuration

The UI communicates with the API at `http://localhost:8000/surabank`. Set `NEXT_PUBLIC_API_URL` environment variable if needed.