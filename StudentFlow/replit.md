# Overview

This is a full-stack productivity dashboard application built with React (frontend) and Express.js (backend). The application focuses on helping users manage their study/work sessions through a Pomodoro timer and assignment tracking system. It features a clean, modern UI built with shadcn/ui components and Tailwind CSS, providing users with tools to track focus sessions, manage assignments, and monitor productivity statistics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built as a Single Page Application (SPA) using React with TypeScript. The architecture follows a component-based approach with:
- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod for validation
- **Build Tool**: Vite for fast development and optimized builds

The frontend is structured with clear separation between pages, components, and utility functions. UI components are built using Radix UI primitives through shadcn/ui, ensuring accessibility and consistency.

## Backend Architecture
The server follows a RESTful API design using Express.js:
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for CRUD operations on assignments
- **Data Validation**: Zod schemas for request validation
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with tsx and Vite integration for SSR

The backend uses a layered architecture with routes handling HTTP requests and a storage abstraction layer for data persistence.

## Data Storage
The application uses a hybrid storage approach:
- **Development**: In-memory storage (MemStorage class) for rapid development and testing
- **Production**: PostgreSQL with Drizzle ORM configured for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management

The storage layer is abstracted through an interface, allowing easy switching between implementations.

## Authentication & Authorization
Currently, the application has basic user schema defined but no active authentication system implemented. The schema includes user management with username/password fields, prepared for future authentication integration.

## Component Architecture
The frontend uses a modular component structure:
- **UI Components**: Reusable shadcn/ui components in `/components/ui`
- **Feature Components**: Business logic components like PomodoroTimer and AssignmentManager
- **Layout Components**: Dashboard layout with header and responsive grid system
- **Modal/Dialog System**: For adding and editing assignments

## State Management Strategy
- **Server State**: TanStack Query handles API calls, caching, and synchronization
- **Local State**: React hooks for component-level state (timer, form inputs)
- **Persistent State**: localStorage for timer statistics and user preferences
- **Form State**: React Hook Form for complex form management with validation

## Build & Deployment Architecture
- **Development**: Vite dev server with HMR and Express backend proxy
- **Production Build**: Vite builds the React app, esbuild bundles the server
- **Asset Handling**: Static files served from Express in production
- **Environment**: Configured for both development and production environments

# External Dependencies

## Database & ORM
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle ORM**: Type-safe SQL toolkit and ORM
- **Drizzle Kit**: Database migration and introspection tools

## UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Custom fonts (Manrope, Architects Daughter, DM Sans, Fira Code, Geist Mono)

## Development & Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and development tooling
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS & Autoprefixer**: CSS processing and browser compatibility

## Form & Validation
- **React Hook Form**: Performant form library with validation
- **Zod**: Schema validation library for runtime type checking
- **@hookform/resolvers**: Integration between React Hook Form and validation libraries

## State Management & HTTP
- **TanStack Query**: Server state management, caching, and synchronization
- **Wouter**: Lightweight routing library for React

## Utility Libraries
- **clsx & class-variance-authority**: Dynamic class name generation
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **cmdk**: Command palette implementation