# Football Lineup Manager

## Overview

A modern football (soccer) team lineup management application built with React and Express. The application allows coaches and team managers to create, organize, and visualize football team lineups using different formations. Users can manage players, assign them to positions on an interactive soccer field, and handle team information. The app features a visual soccer field interface where players can be dynamically assigned to positions based on the selected formation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **UI Library**: Shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod for validation

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod schemas shared between frontend and backend
- **Session Management**: Express sessions with PostgreSQL session store
- **Development Setup**: Vite integration for hot module replacement in development

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Design**:
  - Players table: stores player information (name, number, position, status, age, notes)
  - Teams table: stores team data (name, coach, formation, captain, man of the match)
  - Lineups table: stores lineup configurations with formation and position assignments
- **Development Storage**: In-memory storage implementation for development/testing

### Key Features Architecture
- **Formation System**: Support for multiple football formations (4-4-2, 4-3-3, 3-5-2, 4-5-1, 5-3-2)
- **Interactive Field**: Visual soccer field component with drag-and-drop position assignment
- **Player Management**: CRUD operations for player data with status tracking
- **Responsive Design**: Mobile-first approach with collapsible sidebar for smaller screens

### External Dependencies

- **Database**: Neon PostgreSQL serverless database for production data storage
- **UI Components**: Radix UI primitives for accessible component foundation
- **Icons**: Lucide React for consistent iconography
- **Development Tools**: 
  - Replit integration for cloud development environment
  - Vite plugins for enhanced development experience
  - TypeScript for compile-time type checking
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Custom CSS variables for dark theme support
  - Google Fonts (Inter, DM Sans, Fira Code, Geist Mono) for typography