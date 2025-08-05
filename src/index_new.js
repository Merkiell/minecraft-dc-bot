const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { loadCommands } = require("./utils/commandLoader");
const { loadEvents } = require("./utils/eventLoader");
const { logger } = require("./utils/logger");
const { startServerMonitoring } = require("./services/serverMonitor");
require("dotenv").config();

class DiscordBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.client.commands = new Collection();
    this.init();
  }

  async init() {
    try {
      // Load commands and events
      await loadCommands(this.client);
      await loadEvents(this.client);

      logger.info("Attempting to login to Discord...");
      logger.debug(
        "Bot token (first 20 chars):",
        process.env.DISCORD_BOT_TOKEN?.substring(0, 20) + "..."
      );

      // Start the bot
      await this.client.login(process.env.DISCORD_BOT_TOKEN);

      logger.info("Discord bot initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize Discord bot:");
      logger.error("Error message:", error.message || "No message");
      logger.error("Error code:", error.code || "No code");
      logger.error("Error stack:", error.stack || "No stack");
      logger.error("Full error object:", JSON.stringify(error, null, 2));
      process.exit(1);
    }
  }

  async start() {
    // Start server monitoring after bot is ready
    this.client.once("ready", () => {
      logger.info(`Bot is ready! Logged in as ${this.client.user.tag}`);
      startServerMonitoring(this.client);
    });
  }
}

// Create and start the bot
const bot = new DiscordBot();
bot.start();

// Graceful shutdown
process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully...");
  bot.client.destroy();
  process.exit(0);
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  process.exit(1);
});
