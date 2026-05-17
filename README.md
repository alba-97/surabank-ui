# SuraBank UI

User interface for the SuraBank banking application.

<img width="409" height="644" alt="1" src="https://github.com/user-attachments/assets/8875ffc7-66ae-45c9-a109-ddc719ead1e0" />
<img width="410" height="644" alt="2" src="https://github.com/user-attachments/assets/5c660c65-4e9a-4d9b-92f7-1b0cc35ec450" />
<img width="410" height="644" alt="4" src="https://github.com/user-attachments/assets/e417dad5-3fde-454c-b942-779306f5764f" />
<img width="410" height="644" alt="3" src="https://github.com/user-attachments/assets/d62bb674-21f7-4685-bc48-4c5de10bacd9" />

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Animations**: Framer Motion
- **HTTP**: Axios

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

The UI communicates with the API at `http://localhost:8000`. Set `NEXT_PUBLIC_API_URL` environment variable if needed.
