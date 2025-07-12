# Deploying to Render.com

This guide shows how to deploy your Discord bot dashboard to Render.com for free 24/7 hosting.

## Why Render.com?

- **Free tier**: 750 hours/month (enough for 24/7 hosting)
- **Easy setup**: Connect GitHub and deploy in minutes
- **No credit card**: Required for free tier
- **Auto-deploy**: Automatically deploys when you push to GitHub
- **SSL included**: Free HTTPS certificates
- **Global CDN**: Fast worldwide performance

## Step 1: Prepare Your Repository

1. Create a new GitHub repository
2. Push your project code to GitHub
3. Make sure all files are committed including `render.yaml`

## Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account (free)
3. Authorize Render to access your GitHub repositories

## Step 3: Create New Web Service

1. Click "New +" in Render dashboard
2. Select "Web Service"
3. Connect your GitHub repository
4. Use these settings:
   - **Name**: discord-key-bot-dashboard
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

## Step 4: Add Environment Variables

In the Render dashboard, add these environment variables:

```
DATABASE_URL=your_postgresql_connection_string
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
SESSION_SECRET=your_session_secret_key
DISCORD_MONTH_KEY_USERS=comma_separated_discord_ids
```

## Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your app
3. You'll get a free URL like: `https://your-app-name.onrender.com`

## Step 6: Update Discord OAuth

Update your Discord app's OAuth2 redirect URL to:
```
https://your-app-name.onrender.com/api/callback
```

## Important Notes

- **Free tier limitations**: 
  - 750 hours/month (enough for 24/7)
  - 512MB RAM
  - 100GB bandwidth
  - 15-minute sleep after 15 minutes of inactivity
  - Wakes up automatically when accessed

- **Keep-alive**: Your dashboard will sleep after 15 minutes of no activity, but wakes up instantly when someone visits

- **Database**: Use your existing PostgreSQL database or create a new one

- **Bot separation**: Keep your Discord bot running on Wispbyte (24/7) and only host the dashboard on Render

## Architecture After Deployment

- **Discord Bot**: Running on Wispbyte (free 24/7)
- **Web Dashboard**: Running on Render (free with sleep)
- **Database**: PostgreSQL (shared between both)
- **Authentication**: Discord OAuth through Render app

Both systems share the same database, so bot activity shows up in real-time on the dashboard.

## Troubleshooting

- **Build fails**: Check that all dependencies are in package.json
- **App won't start**: Verify environment variables are set correctly
- **Database connection**: Ensure DATABASE_URL is correct
- **OAuth issues**: Check Discord redirect URL matches your Render domain