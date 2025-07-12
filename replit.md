# Discord Key Bot Dashboard

## Overview

This is a full-stack web application that manages a Discord bot for generating and tracking time-limited access keys for a Roblox executor. The system includes a Discord bot that responds to slash commands and a React-based dashboard for monitoring bot activity, user statistics, and key management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and data layers:

### Frontend Architecture
- **React SPA**: Built with React 18 using TypeScript for type safety
- **UI Framework**: shadcn/ui components with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens for consistent theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Express.js**: Node.js server with TypeScript for API endpoints
- **Discord Bot**: Discord.js v14 for bot functionality with slash commands
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

## Key Components

### Discord Bot (`server/discord-bot.ts`)
- Handles `/generate24key` slash command with smart key reuse
- Handles `/generate1mkey` slash command for VIP users (month-long transferable keys)
- Handles `/setup-logs` command to set Discord channel for real-time logging
- Smart key reuse: Returns existing active key instead of generating duplicates (24h keys only)
- Generates unique access keys with 24-hour or 30-day expiration
- Real-time Discord channel logging for all bot activities
- Logs all bot activities for monitoring with file persistence
- Implements comprehensive error handling and user feedback

### API Layer (`server/routes.ts`)
- **GET /api/stats**: Dashboard statistics (total keys, active keys, users today, success rate)
- **GET /api/keys/recent**: Recent key generation history
- **GET /api/cooldowns**: Active user cooldowns
- **GET /api/logs**: Bot activity logs with filtering
- **GET /api/keys/validate/:keyCode/:discordUserId**: User-specific key validation (allows transferable month keys)
- **GET /api/keys/validate/:keyCode**: Legacy key validation (backward compatibility)

### Data Storage (`server/storage.ts`)
- **Abstracted Storage Interface**: Supports both in-memory and database storage
- **Key Management**: Create, retrieve, expire, and track access keys
- **User Cooldowns**: Prevent spam by enforcing 24-hour cooldowns
- **Activity Logging**: Track all bot interactions and errors
- **Statistics**: Real-time metrics for dashboard display

### Database Schema (`shared/schema.ts`)
- **users**: Basic user authentication (extensible)
- **keys**: Access key storage with expiration and Discord user tracking
- **userCooldowns**: 24-hour cooldown enforcement per Discord user
- **botLogs**: Comprehensive activity and error logging

### Dashboard UI (`client/src/pages/dashboard.tsx`)
- Real-time statistics cards with auto-refresh
- Recent key activity timeline
- Active cooldowns management
- Bot logs with filtering capabilities
- Responsive design for mobile and desktop

## Data Flow

1. **24-Hour Key Generation Flow**:
   - User runs `/generate24key` in Discord
   - Bot checks for existing active key for that user
   - If active key exists, returns the same key with remaining time
   - If no active key, generates new unique key with 24-hour expiration
   - Key stored in database with user association
   - User receives key via Discord response with status indication

2. **Month Key Generation Flow**:
   - VIP user runs `/generate1mkey` in Discord
   - Bot checks user authorization (limited to 3 specific users)
   - Always generates new unique transferable key with 30-day expiration
   - Key stored in database but can be used by anyone
   - VIP user receives transferable key that can be shared

3. **Real-time Discord Logging**:
   - Admin runs `/setup-logs` to set Discord channel as logs channel
   - All bot activities logged to designated Discord channel
   - Key generation events, VIP status, and user activities tracked
   - Error and warning notifications sent to logs channel

4. **Dashboard Monitoring**:
   - Frontend polls API endpoints every 30 seconds
   - Real-time updates of statistics and activity
   - Historical data visualization
   - Administrative oversight of bot operations

5. **Cooldown Management**:
   - Automatic enforcement of 24-hour per-user limits (24h keys only)
   - Month keys have no cooldown restrictions
   - Cooldown tracking with expiration cleanup
   - User feedback on remaining cooldown time

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **discord.js**: Discord bot API integration
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives

### Development Tools
- **tsx**: TypeScript execution for development
- **vite**: Frontend build tool and dev server
- **tailwindcss**: Utility-first CSS framework
- **esbuild**: Backend bundling for production

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with auto-restart on changes
- **Database**: PostgreSQL with Drizzle migrations

### Production
- **Frontend**: Static build served by Express
- **Backend**: Compiled JavaScript bundle
- **Database**: PostgreSQL with connection pooling
- **Environment**: Requires `DATABASE_URL`, `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, and `DISCORD_MONTH_KEY_USERS`

### Build Process
1. Frontend builds to `dist/public`
2. Backend compiles to `dist/index.js`
3. Database migrations run via `drizzle-kit push`
4. Single process serves both frontend and API

The architecture prioritizes type safety, real-time monitoring, and scalable bot management while maintaining a clean separation of concerns between the Discord bot functionality and the web dashboard.

## Recent Changes: Latest modifications with dates

### July 12, 2025 - Complete VIP Dashboard System Deployed
- Successfully deployed Discord bot to Wispbyte free hosting platform running 24/7 completely free
- Built complete Discord OAuth authentication system for VIP dashboard access
- Implemented PostgreSQL database with user sessions and authentication storage
- Created beautiful landing page with Discord login integration
- Fixed Discord OAuth callback URL configuration and session handling
- Successfully authenticated user (Discord ID: 1314723072695341059) with VIP verification
- Updated VIP user list with correct Discord IDs for user + 3 friends
- Dashboard fully functional with real-time bot monitoring, key management, and activity logs
- Project goal achieved: Free 24/7 Discord bot hosting + private VIP dashboard with Discord OAuth

### July 12, 2025 - Render.com Deployment Configuration
- Set up Render.com deployment configuration as free alternative to Vercel
- Created render.yaml with optimized settings for free tier (750 hours/month)
- Added comprehensive deployment guide in RENDER_DEPLOYMENT.md
- Configured health check endpoint for Render monitoring
- Ready for one-click deployment: connect GitHub → auto-deploy
- Architecture: Bot on Wispbyte + Dashboard on Render + Shared PostgreSQL database