const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getServerStatus } = require("../services/aternosService");
const { logger } = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstatus")
    .setDescription("Check the status of all Minecraft servers"),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const servers = await getServerStatus();

      if (!servers || servers.length === 0) {
        const embed = new EmbedBuilder()
          .setColor(0xff6b6b)
          .setTitle("🔍 Server Status")
          .setDescription("No servers found or unable to fetch server data.")
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0x4ecdc4)
        .setTitle("🖥️ Minecraft Server Status")
        .setDescription("Current status of all your Aternos servers:")
        .setTimestamp()
        .setFooter({ text: "Aternos Server Monitor" });

      servers.forEach((server, index) => {
        const statusEmoji = server.online ? "🟢" : "🔴";
        const statusText = server.online ? "Online" : "Offline";

        embed.addFields({
          name: `${statusEmoji} ${server.name || `Server ${index + 1}`}`,
          value: `**Status:** ${statusText}\n**Players:** ${
            server.players || "N/A"
          }\n**Version:** ${server.version || "Unknown"}`,
          inline: true,
        });
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error("Error fetching server status:", error);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xff6b6b)
        .setTitle("❌ Error")
        .setDescription(
          "Failed to fetch server status. Please try again later."
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
