const { Events } = require("discord.js");
const { logger } = require("../utils/logger");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logger.info(`Ready! Logged in as ${client.user.tag}`);
    logger.info(`Bot is serving ${client.guilds.cache.size} guilds`);

    // Set bot status
    client.user.setPresence({
      activities: [
        {
          name: "Minecraft servers on Aternos",
          type: 3, // WATCHING
        },
      ],
      status: "online",
    });
  },
};
