# Overview

GameArena is a competitive gaming tournament platform focused on mobile battle royale games (PUBG and Free Fire). The application enables users to participate in esports tournaments, manage their gaming wallets, track performance through leaderboards, and includes comprehensive admin functionality for tournament management. The platform operates on a freemium model where users pay entry fees to join tournaments and compete for prize pools.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design system including dark theme and neon gaming aesthetics
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Layout**: Responsive design with mobile-first approach, featuring bottom navigation for mobile and header navigation for desktop

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon (serverless PostgreSQL)
- **API Design**: RESTful API architecture with clear endpoint organization
- **Validation**: Shared Zod schemas between frontend and backend for consistent data validation
- **Development**: Hot module replacement with Vite middleware integration

## Database Design
The schema includes several core entities:
- **Users**: User profiles with gaming statistics, wallet balances, and administrative roles
- **Tournaments**: Tournament definitions with game types, entry fees, prize pools, and status tracking
- **Tournament Participants**: Junction table linking users to tournaments with participation details
- **Transactions**: Financial transaction records for deposits, withdrawals, and tournament fees
- **Leaderboard Entries**: Performance tracking across different time periods

## Authentication & Authorization
- **Authentication**: Email/password based authentication with session management
- **Authorization**: Role-based access control with admin privileges for tournament management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Client State**: Local storage for persisting user authentication state

## Key Features
- **Tournament System**: Create, join, and manage gaming tournaments with multiple game modes
- **Wallet Management**: Integrated financial system for deposits, withdrawals, and tournament entry fees
- **Real-time Updates**: Live tournament status tracking and participant management
- **Leaderboard System**: Performance tracking with daily, weekly, and monthly rankings
- **Admin Dashboard**: Comprehensive admin interface for user management, tournament oversight, and financial reporting
- **Responsive Design**: Mobile-optimized interface with floating action buttons and touch-friendly navigation

## Development Patterns
- **Type Safety**: Full TypeScript implementation with shared types between client and server
- **Component Architecture**: Modular component design with clear separation of concerns
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Code Organization**: Clear separation between client, server, and shared code directories

# External Dependencies

## Database & Backend Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Drizzle ORM**: Type-safe database operations and schema management
- **Express.js**: Web application framework for API endpoints

## Frontend Libraries
- **React Ecosystem**: React 18, React DOM, and React Hook Form for UI development
- **TanStack Query**: Server state management and data fetching
- **Radix UI**: Accessible component primitives for building the UI
- **Wouter**: Lightweight routing library for single-page application navigation
- **Tailwind CSS**: Utility-first CSS framework for styling

## Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Static type checking and enhanced developer experience
- **Zod**: Runtime type validation and schema definition
- **PostCSS**: CSS processing with Tailwind CSS integration

## UI & Design
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Web fonts including Inter, DM Sans, Fira Code, and Geist Mono
- **Class Variance Authority**: Utility for creating variant-based component APIs

## Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **nanoid**: Unique ID generation for various application needs