const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AternosResearch } = require('../services/aternosResearch');
const { logger } = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('research')
        .setDescription('[DEV] Research Aternos website structure for integration'),
    
    async execute(interaction) {
        // Only allow this command for developers/admins
        // Replace 'YOUR_DISCORD_USER_ID' with your actual Discord user ID
        if (interaction.user.id !== 'YOUR_DISCORD_USER_ID') {
            await interaction.reply({ 
                content: '❌ This command is only available for developers.', 
                ephemeral: true 
            });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const research = new AternosResearch();
        
        try {
            const embed = new EmbedBuilder()
                .setColor(0x4ECDC4)
                .setTitle('🔬 Aternos Research')
                .setDescription('Starting research of Aternos website structure...')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            // Initialize browser
            const browserInit = await research.init();
            if (!browserInit) {
                throw new Error('Failed to initialize browser');
            }

            // Navigate to Aternos
            const navResult = await research.navigateToAternos();
            if (!navResult) {
                throw new Error('Failed to navigate to Aternos');
            }

            // Research login process
            const loginElements = await research.researchLoginProcess();
            
            // Research server management (even though we're not logged in)
            const serverElements = await research.researchServerManagement();

            // Create results embed
            const resultsEmbed = new EmbedBuilder()
                .setColor(0x4ECDC4)
                .setTitle('🔬 Aternos Research Results')
                .setDescription('Research completed! Check the logs for detailed information.')
                .addFields(
                    {
                        name: '🔐 Login Elements Found',
                        value: `Login Buttons: ${loginElements?.loginButtons?.length || 0}\nUsername Inputs: ${loginElements?.usernameInputs?.length || 0}\nPassword Inputs: ${loginElements?.passwordInputs?.length || 0}`,
                        inline: true
                    },
                    {
                        name: '🖥️ Server Elements Found',
                        value: `Server Cards: ${serverElements?.serverCards?.length || 0}\nStatus Elements: ${serverElements?.serverStatus?.length || 0}`,
                        inline: true
                    },
                    {
                        name: '📝 Next Steps',
                        value: '1. Check bot logs for detailed element info\n2. Analyze screenshot: `aternos-homepage.png`\n3. Implement login logic\n4. Build server status extraction',
                        inline: false
                    }
                )
                .setTimestamp()
                .setFooter({ text: 'Research Phase - Aternos Integration' });

            await interaction.editReply({ embeds: [resultsEmbed] });
            
        } catch (error) {
            logger.error('Research command failed:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('❌ Research Failed')
                .setDescription(`Error: ${error.message}`)
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        } finally {
            await research.cleanup();
        }
    }
};
