# Setup Guide

This guide will help you set up and run the Minecraft Aternos Discord Bot.

## Prerequisites

- Node.js (version 16.0.0 or higher)
- npm (comes with Node.js)
- A Discord application/bot token
- An Aternos account

## Installation Steps

### 1. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

### 2. Environment Configuration

1. Copy the `.env.example` file to `.env`:

   ```bash
   copy .env.example .env
   ```

2. Fill in your configuration values in the `.env` file:

   - **DISCORD_BOT_TOKEN**: Your Discord bot token
   - **CLIENT_ID**: Your Discord application's client ID
   - **GUILD_ID**: Your Discord server ID (optional, for faster command deployment)
   - **ATERNOS_USERNAME**: Your Aternos username
   - **ATERNOS_PASSWORD**: Your Aternos password
   - **NOTIFICATION_CHANNEL_ID**: Discord channel ID for notifications
   - **CHECK_INTERVAL_MINUTES**: How often to check servers (default: 5)

### 3. Discord Bot Setup

#### Create a Discord Application:

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Give it a name and create it
4. Go to the "Bot" section
5. Click "Add Bot"
6. Copy the token and add it to your `.env` file as `DISCORD_BOT_TOKEN`
7. Copy the Application ID and add it to your `.env` file as `CLIENT_ID`

#### Invite the Bot to Your Server:

1. In the Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Select "bot" and "applications.commands" scopes
3. Select the following bot permissions:
   - Send Messages
   - Use Slash Commands
   - Embed Links
   - Read Message History
4. Copy the generated URL and visit it to invite the bot

#### Get Channel and Guild IDs:

1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click your server name and "Copy ID" - this is your `GUILD_ID`
3. Right-click the channel where you want notifications and "Copy ID" - this is your `NOTIFICATION_CHANNEL_ID`

### 4. Deploy Slash Commands

Run this command to register the bot's slash commands:

```bash
node deploy-commands.js
```

### 5. Start the Bot

For development (with auto-restart):

```bash
npm run dev
```

For production:

```bash
npm start
```

## Current Features

- **Ping Command** (`/ping`): Check bot latency and status
- **Server Status Command** (`/serverstatus`): Get current status of all Minecraft servers
- **Automatic Monitoring**: Checks server status every 5 minutes and sends notifications
- **Daily Reports**: Sends a daily summary at 9 AM

## Important Notes

⚠️ **Aternos Integration**: The Aternos service is currently using mock data for development. You'll need to implement the actual Aternos API integration based on their current API or web scraping methods.

## File Structure

```
src/
├── commands/           # Slash commands
├── events/            # Discord event handlers
├── services/          # Core services (Aternos, monitoring)
├── utils/             # Utility functions
└── index.js           # Main bot file
```

## Logs

- Bot logs are stored in the `logs/` directory
- Log level can be configured with the `LOG_LEVEL` environment variable
- Available levels: error, warn, info, debug

## Troubleshooting

1. **Bot not responding**: Check if the bot is online in Discord and verify the token
2. **Commands not showing**: Make sure you ran `deploy-commands.js` and the bot has proper permissions
3. **Notifications not working**: Verify the `NOTIFICATION_CHANNEL_ID` and bot permissions in that channel

## Next Steps

1. Implement actual Aternos API integration in `src/services/aternosService.js`
2. Add more commands (start/stop servers, player lists, etc.)
3. Implement user permissions and role-based access
4. Add configuration commands for settings
5. Deploy to a cloud service for 24/7 operation
