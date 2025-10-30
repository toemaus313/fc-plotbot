import {
  Client,
  GatewayIntentBits,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ModalActionRowComponentBuilder,
  ChatInputCommandInteraction,
  ModalSubmitInteraction
} from 'discord.js';
import dotenv from 'dotenv';
import { fcRouteCommand } from './commands';
import { submitRouteRequest, waitForRoute } from './spansh';
import { RouteRequest } from './types';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Handle slash command
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'fcroute') {
    await handleFCRouteCommand(interaction);
  }
});

// Handle modal submission
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'fcRouteModal') {
    await handleModalSubmit(interaction);
  }
});

async function handleFCRouteCommand(interaction: ChatInputCommandInteraction) {
  // Create modal
  const modal = new ModalBuilder()
    .setCustomId('fcRouteModal')
    .setTitle('Fleet Carrier Route Plotter');

  // Create text input fields
  const startSystemInput = new TextInputBuilder()
    .setCustomId('startSystem')
    .setLabel('Start System')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('e.g., Sol')
    .setRequired(true);

  const destinationSystemInput = new TextInputBuilder()
    .setCustomId('destinationSystem')
    .setLabel('Destination System')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('e.g., Colonia')
    .setRequired(true);

  const capacityUsedInput = new TextInputBuilder()
    .setCustomId('capacityUsed')
    .setLabel('Current Capacity Used (tons)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('e.g., 5000')
    .setValue('0')
    .setRequired(true);

  const fuelInput = new TextInputBuilder()
    .setCustomId('fuel')
    .setLabel('Fuel On Board (tritium)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('e.g., 1000')
    .setValue('1000')
    .setRequired(true);

  // Add inputs to action rows
  const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(startSystemInput);
  const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(destinationSystemInput);
  const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(capacityUsedInput);
  const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(fuelInput);

  modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

  await interaction.showModal(modal);
}

async function handleModalSubmit(interaction: ModalSubmitInteraction) {
  const startSystem = interaction.fields.getTextInputValue('startSystem');
  const destinationSystem = interaction.fields.getTextInputValue('destinationSystem');
  const capacityUsedStr = interaction.fields.getTextInputValue('capacityUsed');
  const fuelStr = interaction.fields.getTextInputValue('fuel');

  // Validate inputs
  const capacityUsed = parseInt(capacityUsedStr, 10);
  const fuel = parseInt(fuelStr, 10);

  if (isNaN(capacityUsed) || isNaN(fuel)) {
    await interaction.reply({
      content: '❌ Invalid input! Capacity and fuel must be numbers.',
      ephemeral: true,
    });
    return;
  }

  if (capacityUsed < 0 || fuel < 0) {
    await interaction.reply({
      content: '❌ Invalid input! Capacity and fuel must be positive numbers.',
      ephemeral: true,
    });
    return;
  }

  if (capacityUsed > 25000) {
    await interaction.reply({
      content: '❌ Invalid input! Fleet Carriers have a maximum cargo capacity of 25,000 tons.',
      ephemeral: true,
    });
    return;
  }

  // Defer reply as route calculation may take time
  await interaction.deferReply();

  try {
    const routeRequest: RouteRequest = {
      source: startSystem,
      destination: destinationSystem,
      capacity_used: capacityUsed,
      fuel: fuel,
    };

    // Submit request to Spansh API
    const jobId = await submitRouteRequest(routeRequest);

    // Update user
    await interaction.editReply('🔄 Route calculation in progress... This may take a few moments.');

    // Wait for route result
    const result = await waitForRoute(jobId);

    if (!result.result) {
      await interaction.editReply('❌ Failed to calculate route. Please check your system names and try again.');
      return;
    }

    // Calculate route statistics from jumps array
    const { jumps } = result.result;
    const totalJumps = jumps.length - 1; // Subtract 1 because first jump is the starting system
    const totalDistance = jumps.reduce((sum, jump) => sum + jump.distance, 0);
    const totalTritium = jumps.reduce((sum, jump) => sum + jump.fuel_used, 0);

    // Create embed with route information
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('🚀 Fleet Carrier Route')
      .setDescription(`Route from **${startSystem}** to **${destinationSystem}**`)
      .addFields(
        { name: 'Total Jumps', value: `${totalJumps}`, inline: true },
        { name: 'Total Distance', value: `${totalDistance.toFixed(2)} LY`, inline: true },
        { name: 'Tritium Required', value: `${totalTritium} tons`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Powered by Spansh.co.uk' });

    // Add first few waypoints (skip the starting system)
    if (jumps.length > 1) {
      const waypointList = jumps
        .slice(1, 11) // Skip first (starting system), take next 10
        .map((jump, idx) => {
          const refuelIcon = jump.must_restock ? ' ⛽' : '';
          const ringIcon = jump.has_icy_ring ? ' 🪐' : '';
          return `${idx + 1}. ${jump.name}${refuelIcon}${ringIcon}`;
        })
        .join('\n');
      
      embed.addFields({
        name: `Route Preview (first ${Math.min(10, totalJumps)} of ${totalJumps} waypoints)`,
        value: waypointList || 'No waypoints',
      });
    }

    // Add link to full route
    embed.addFields({
      name: 'Full Route',
      value: `[View on Spansh](https://spansh.co.uk/fleet-carrier/results/${jobId})`,
    });

    // Check if fuel is sufficient
    if (totalTritium > fuel) {
      embed.addFields({
        name: '⚠️ Warning',
        value: `You need ${totalTritium - fuel} more tons of tritium to complete this route!`,
      });
    }

    await interaction.editReply({ content: null, embeds: [embed] });

  } catch (error) {
    console.error('Error calculating route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    await interaction.editReply(`❌ Error: ${errorMessage}`);
  }
}

// Login to Discord
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('DISCORD_TOKEN is not set in .env file');
  process.exit(1);
}

client.login(token);
