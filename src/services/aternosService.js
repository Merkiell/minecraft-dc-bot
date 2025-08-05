const axios = require("axios");
const { logger } = require("../utils/logger");

class AternosService {
  constructor() {
    this.username = process.env.ATERNOS_USERNAME;
    this.password = process.env.ATERNOS_PASSWORD;
    this.session = null;
    this.servers = [];
    this.lastUpdate = null;
  }

  async authenticate() {
    try {
      // This is a placeholder implementation
      // You'll need to implement actual Aternos API authentication
      // For now, this returns mock data for development

      logger.info("Attempting to authenticate with Aternos...");

      // Mock authentication - replace with actual implementation
      this.session = {
        authenticated: true,
        sessionId: "mock_session_" + Date.now(),
      };

      logger.info("Successfully authenticated with Aternos");
      return true;
    } catch (error) {
      logger.error("Failed to authenticate with Aternos:", error);
      throw new Error("Aternos authentication failed");
    }
  }

  async fetchServers() {
    try {
      if (!this.session || !this.session.authenticated) {
        await this.authenticate();
      }

      // This is a placeholder implementation
      // You'll need to implement actual Aternos API calls

      logger.debug("Fetching servers from Aternos...");

      // Mock server data - replace with actual API calls
      const mockServers = [
        {
          id: "server1",
          name: "My Minecraft Server",
          online: Math.random() > 0.5,
          players: Math.floor(Math.random() * 10),
          maxPlayers: 20,
          version: "1.20.1",
          ip: "server1.aternos.me",
          port: 25565,
        },
        {
          id: "server2",
          name: "Creative World",
          online: Math.random() > 0.7,
          players: Math.floor(Math.random() * 5),
          maxPlayers: 10,
          version: "1.19.4",
          ip: "server2.aternos.me",
          port: 25565,
        },
      ];

      this.servers = mockServers;
      this.lastUpdate = new Date();

      logger.debug(`Fetched ${this.servers.length} servers from Aternos`);
      return this.servers;
    } catch (error) {
      logger.error("Failed to fetch servers from Aternos:", error);
      throw new Error("Failed to fetch server data");
    }
  }

  async getServerStatus() {
    try {
      await this.fetchServers();
      return this.servers;
    } catch (error) {
      logger.error("Error getting server status:", error);
      return [];
    }
  }

  async getServerById(serverId) {
    try {
      await this.fetchServers();
      return this.servers.find((server) => server.id === serverId);
    } catch (error) {
      logger.error(`Error getting server ${serverId}:`, error);
      return null;
    }
  }

  isDataStale(maxAgeMinutes = 5) {
    if (!this.lastUpdate) return true;
    const ageMinutes = (Date.now() - this.lastUpdate.getTime()) / (1000 * 60);
    return ageMinutes > maxAgeMinutes;
  }

  getCachedServers() {
    return this.servers;
  }
}

// Create singleton instance
const aternosService = new AternosService();

// Export functions for easier use
module.exports = {
  getServerStatus: () => aternosService.getServerStatus(),
  getServerById: (id) => aternosService.getServerById(id),
  getCachedServers: () => aternosService.getCachedServers(),
  isDataStale: (minutes) => aternosService.isDataStale(minutes),
  aternosService,
};
