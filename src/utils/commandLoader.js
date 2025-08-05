const fs = require("fs");
const path = require("path");
const { logger } = require("./logger");

async function loadCommands(client) {
  const commandsPath = path.join(__dirname, "..", "commands");

  if (!fs.existsSync(commandsPath)) {
    logger.warn("Commands directory does not exist, creating it...");
    fs.mkdirSync(commandsPath, { recursive: true });
    return;
  }

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        logger.info(`Loaded command: ${command.data.name}`);
      } else {
        logger.warn(
          `Command ${file} is missing required "data" or "execute" property`
        );
      }
    } catch (error) {
      logger.error(`Error loading command ${file}:`, error);
    }
  }

  logger.info(`Loaded ${client.commands.size} commands`);
}

module.exports = { loadCommands };
