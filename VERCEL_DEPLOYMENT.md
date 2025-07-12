# Deploying to Vercel

This guide shows how to deploy your Discord bot dashboard to Vercel.

## Prerequisites

1. A Vercel account (vercel.com)
2. Your Discord bot running separately (keep it on Wispbyte)
3. A PostgreSQL database (you can use the same one)

## Important Notes

- **Discord Bot**: Keep your Discord bot running on Wispbyte (free 24/7)
- **Dashboard Only**: Deploy only the web dashboard to Vercel
- **Database**: Use the same PostgreSQL database for both

## Step 1: Prepare for Vercel

1. Create a new repository on GitHub with these files
2. Copy the `vercel.json` file (already created)
3. Modify the Discord auth callback URL in your Discord app settings to use your Vercel domain

## Step 2: Environment Variables

In Vercel dashboard, add these environment variables:

```
DATABASE_URL=your_postgresql_connection_string
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
SESSION_SECRET=your_session_secret
```

## Step 3: Disable Discord Bot on Vercel

Create a modified server entry point that doesn't start the Discord bot:

```typescript
// server/vercel-index.ts
import express from 'express';
import { registerRoutes } from './routes';

const app = express();

// Only register web routes, no Discord bot
async function startServer() {
  await registerRoutes(app, { startBot: false });
  return app;
}

export default startServer();
```

## Step 4: Deploy

1. Connect your GitHub repo to Vercel
2. Deploy with these settings:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

## Step 5: Update Discord OAuth

Update your Discord app's OAuth2 redirect URL to:
```
https://your-vercel-app.vercel.app/api/callback
```

## Architecture After Deployment

- **Discord Bot**: Running on Wispbyte (free 24/7)
- **Web Dashboard**: Running on Vercel (serverless)
- **Database**: PostgreSQL (shared between both)
- **Authentication**: Discord OAuth through Vercel app

Both the bot and dashboard will use the same database, so key generation from Discord will show up in the Vercel dashboard in real-time.