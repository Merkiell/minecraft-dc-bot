const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency and status"),

  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    const embed = new EmbedBuilder()
      .setColor(0x4ecdc4)
      .setTitle("🏓 Pong!")
      .addFields(
        {
          name: "Roundtrip latency",
          value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`,
          inline: true,
        },
        {
          name: "Websocket heartbeat",
          value: `${interaction.client.ws.ping}ms`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Bot Status Check" });

    await interaction.editReply({
      content: null,
      embeds: [embed],
    });
  },
};
