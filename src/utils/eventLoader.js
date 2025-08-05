const fs = require("fs");
const path = require("path");
const { logger } = require("./logger");

async function loadEvents(client) {
  const eventsPath = path.join(__dirname, "..", "events");

  if (!fs.existsSync(eventsPath)) {
    logger.warn("Events directory does not exist, creating it...");
    fs.mkdirSync(eventsPath, { recursive: true });
    return;
  }

  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    try {
      const event = require(filePath);

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }

      logger.info(`Loaded event: ${event.name}`);
    } catch (error) {
      logger.error(`Error loading event ${file}:`, error);
    }
  }

  logger.info(`Loaded ${eventFiles.length} events`);
}

module.exports = { loadEvents };
