# Prism Key Dashboard

A Discord bot for generating and managing Roblox executor access keys with a web dashboard.

## Features

- **Discord Bot Commands:**
  - `/generate24key` - 24-hour keys with smart reuse
  - `/generate1mkey` - 30-day transferable keys (VIP only)
  - `/generateyearkey` - 365-day transferable keys (VIP only)
  - `/generatelifetime` - 50-year transferable keys (VIP only)
  - `/setup-logs` - Set Discord channel for real-time logging

- **Web Dashboard:**
  - Real-time statistics and bot status
  - Recent key activity timeline
  - Bot logs with filtering
  - Responsive design

## Environment Variables

```
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_app_id
DISCORD_MONTH_KEY_USERS=comma,separated,user,ids
```

## Deployment

This project is ready for deployment on Railway, Render, or similar platforms.

### Railway Deployment
1. Push this repo to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy automatically

## Local Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm start
```