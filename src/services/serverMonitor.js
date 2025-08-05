const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const {
  getServerStatus,
  getCachedServers,
  isDataStale,
} = require("./aternosService");
const { logger } = require("../utils/logger");

class ServerMonitor {
  constructor() {
    this.client = null;
    this.notificationChannelId = process.env.NOTIFICATION_CHANNEL_ID;
    this.checkInterval = process.env.CHECK_INTERVAL_MINUTES || 5;
    this.previousServerStates = new Map();
    this.isMonitoring = false;
  }

  init(client) {
    this.client = client;
    this.startMonitoring();
  }

  startMonitoring() {
    if (this.isMonitoring) {
      logger.warn("Server monitoring is already running");
      return;
    }

    // Schedule periodic checks every X minutes
    const cronExpression = `*/${this.checkInterval} * * * *`;

    cron.schedule(cronExpression, async () => {
      try {
        await this.checkServers();
      } catch (error) {
        logger.error("Error during scheduled server check:", error);
      }
    });

    this.isMonitoring = true;
    logger.info(
      `Server monitoring started with ${this.checkInterval} minute intervals`
    );

    // Perform initial check
    setTimeout(() => this.checkServers(), 5000);
  }

  async checkServers() {
    try {
      logger.debug("Checking server status...");

      const servers = await getServerStatus();

      if (!servers || servers.length === 0) {
        logger.warn("No servers found during status check");
        return;
      }

      for (const server of servers) {
        await this.processServerStatus(server);
      }

      logger.debug("Server status check completed");
    } catch (error) {
      logger.error("Error checking servers:", error);
    }
  }

  async processServerStatus(server) {
    const serverId = server.id;
    const isOnline = server.online;
    const previousState = this.previousServerStates.get(serverId);

    // Check for status changes
    if (previousState !== undefined && previousState !== isOnline) {
      await this.sendStatusNotification(server, isOnline, previousState);
    }

    // Update previous state
    this.previousServerStates.set(serverId, isOnline);
  }

  async sendStatusNotification(server, isOnline, wasOnline) {
    try {
      if (!this.notificationChannelId || !this.client) {
        logger.warn(
          "Notification channel not configured or client not available"
        );
        return;
      }

      const channel = await this.client.channels.fetch(
        this.notificationChannelId
      );

      if (!channel) {
        logger.error(
          `Could not find notification channel: ${this.notificationChannelId}`
        );
        return;
      }

      const statusChange = isOnline ? "came online" : "went offline";
      const color = isOnline ? 0x4ecdc4 : 0xff6b6b;
      const emoji = isOnline ? "🟢" : "🔴";

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`${emoji} Server Status Change`)
        .setDescription(`**${server.name}** has ${statusChange}!`)
        .addFields(
          {
            name: "Status",
            value: isOnline ? "Online" : "Offline",
            inline: true,
          },
          { name: "Server IP", value: server.ip || "N/A", inline: true },
          { name: "Version", value: server.version || "Unknown", inline: true }
        );

      if (isOnline && server.players !== undefined) {
        embed.addFields({
          name: "Players Online",
          value: `${server.players}/${server.maxPlayers || "N/A"}`,
          inline: true,
        });
      }

      embed.setTimestamp().setFooter({ text: "Aternos Server Monitor" });

      await channel.send({ embeds: [embed] });

      logger.info(`Sent notification: ${server.name} ${statusChange}`);
    } catch (error) {
      logger.error("Error sending status notification:", error);
    }
  }

  async sendDailyReport() {
    try {
      if (!this.notificationChannelId || !this.client) return;

      const channel = await this.client.channels.fetch(
        this.notificationChannelId
      );
      if (!channel) return;

      const servers = getCachedServers();

      if (!servers || servers.length === 0) {
        logger.warn("No servers available for daily report");
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0x4ecdc4)
        .setTitle("📊 Daily Server Report")
        .setDescription(
          "Here's the current status of all your Minecraft servers:"
        )
        .setTimestamp()
        .setFooter({ text: "Daily Report - Aternos Server Monitor" });

      servers.forEach((server) => {
        const statusEmoji = server.online ? "🟢" : "🔴";
        const statusText = server.online ? "Online" : "Offline";

        embed.addFields({
          name: `${statusEmoji} ${server.name}`,
          value: `**Status:** ${statusText}\n**Players:** ${
            server.players || "N/A"
          }\n**Version:** ${server.version || "Unknown"}`,
          inline: true,
        });
      });

      await channel.send({ embeds: [embed] });
      logger.info("Daily server report sent");
    } catch (error) {
      logger.error("Error sending daily report:", error);
    }
  }

  stopMonitoring() {
    this.isMonitoring = false;
    logger.info("Server monitoring stopped");
  }
}

// Create singleton instance
const serverMonitor = new ServerMonitor();

// Schedule daily report at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    await serverMonitor.sendDailyReport();
  } catch (error) {
    logger.error("Error sending daily report:", error);
  }
});

function startServerMonitoring(client) {
  serverMonitor.init(client);
}

module.exports = {
  startServerMonitoring,
  serverMonitor,
};
