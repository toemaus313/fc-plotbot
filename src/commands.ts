import { SlashCommandBuilder } from 'discord.js';

export const fcRouteCommand = new SlashCommandBuilder()
  .setName('fcroute')
  .setDescription('Plot a Fleet Carrier route using Spansh');
