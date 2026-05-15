# Painel de Governança do Futuro

## Overview

This is an interactive portfolio and personal branding experience for Maria João Goldstein Abujamra, featuring a futuristic "Governance Panel" design. The application showcases a Web3/blockchain-inspired aesthetic with hacker/neural network visual themes. It serves as a living resume, AI agent hub, and manifesto platform combining professional portfolio features with interactive elements like an AI chatbot oracle.

## User Preferences

Preferred communication style: Simple, everyday language.

### Future Ideas (To Implement)
- **Dual Persona Concept**: 
  - MARIA = O Oráculo (chatbot que responde e aconselha)
  - JOÃO = Criador dos agentes e arquiteto da agência IAGENTES
- Date must always be 02/03/1981
- WHITE theme uses ONLY white/beige/sand tones
- BLACK theme uses ONLY gray/black tones

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming (dark/hacker green, white, black themes)
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for interactive animations and transitions
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Framework**: Express.js running on Node.js
- **API Pattern**: RESTful endpoints under `/api/*` prefix
- **Development**: tsx for TypeScript execution, Vite middleware for HMR in development
- **Production**: esbuild bundles server code, static files served from `dist/public`

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Current Storage**: In-memory storage (`MemStorage` class) with interface ready for database migration
- **Tables**: users, chat_messages, contact_submissions, press_articles

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components (layout, ui)
    pages/        # Route pages (Hero, Hub, Timeline, etc.)
    hooks/        # Custom React hooks
    lib/          # Utilities and data files
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data storage interface
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
```

### Theming System
The application supports three visual themes controlled via CSS variables:
- **Dark/Hacker**: Matrix green on deep black (default)
- **White on White**: Minimal light theme
- **Black on Black**: Pure dark theme

### Key Pages
- **Hero**: Landing page with animated background
- **Manifesto**: Sequential text reveal experience
- **Hub**: AI agents grid dashboard
- **Timeline**: Experience/portfolio cards
- **Tokens**: Skills as tokenized assets
- **Chatbot**: AI oracle conversation interface
- **Profile/Stack/Press/Contact**: Standard portfolio pages

## External Dependencies

### Database
- **PostgreSQL**: Required for production (DATABASE_URL environment variable)
- **Drizzle Kit**: Database migrations via `npm run db:push`

### UI Libraries
- **Radix UI**: Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **cmdk**: Command palette component

### Fonts (Google Fonts)
- JetBrains Mono (monospace)
- Orbitron (display/headings)
- Rajdhani (primary sans-serif)
- Space Grotesk (body text)

### Development Tools
- **Replit Plugins**: cartographer, dev-banner, runtime-error-modal
- **PostCSS**: Tailwind CSS processing
- **TypeScript**: Strict mode enabled

### Session Management
- **connect-pg-simple**: PostgreSQL session store (available but not currently active)
- **express-session**: Session middleware infrastructure