# Fleet Carrier Route Plotter Bot

A Discord bot for Elite Dangerous that uses the Spansh.co.uk API to plot Fleet Carrier routes. Users can input their start system, destination, current capacity, and fuel on board through an interactive modal to receive detailed route information.

## Features

- 🚀 **Interactive Modal Interface** - Easy-to-use Discord modal for route planning
- 🗺️ **Spansh API Integration** - Utilizes the powerful Spansh routing engine
- 📊 **Detailed Route Information** - Shows jumps, distance, tritium requirements, and waypoints
- ⚠️ **Fuel Warnings** - Alerts when you don't have enough tritium for the route
- 🔗 **Full Route Links** - Direct links to view complete routes on Spansh.co.uk

## Prerequisites

- Node.js 18.x or higher
- A Discord Bot Token ([Create one here](https://discord.com/developers/applications))
- Discord Application Client ID

## Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your Discord credentials:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_discord_client_id_here
   ```

4. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

5. **Deploy slash commands to Discord:**
   ```bash
   npm run deploy-commands
   ```

6. **Start the bot:**
   ```bash
   npm start
   ```

## Usage

### Setting Up Your Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Go to the "Bot" section and create a bot
4. Copy the bot token and add it to your `.env` file
5. Go to the "OAuth2" section, copy the Client ID and add it to your `.env` file
6. Under OAuth2 > URL Generator, select:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
7. Use the generated URL to invite the bot to your server

### Using the Bot

1. In any Discord channel where the bot has access, type `/fcroute`
2. A modal will appear with four fields:
   - **Start System**: Your current system (e.g., "Sol")
   - **Destination System**: Where you want to go (e.g., "Colonia")
   - **Current Capacity Used**: How many tons of cargo you're carrying (0-25000)
   - **Fuel On Board**: How much tritium you have (in tons)
3. Click "Submit" and wait for the route calculation
4. The bot will display:
   - Total number of jumps required
   - Total distance in light-years
   - Tritium fuel required
   - Preview of the first 10 waypoints
   - Link to view the full route on Spansh
   - Warning if you need more fuel

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled bot
- `npm run dev` - Build and run the bot
- `npm run watch` - Watch for changes and recompile
- `npm run deploy-commands` - Register slash commands with Discord

### Project Structure

```
fc-plotbot/
├── src/
│   ├── index.ts           # Main bot file
│   ├── commands.ts        # Slash command definitions
│   ├── spansh.ts         # Spansh API integration
│   ├── types.ts          # TypeScript type definitions
│   └── deploy-commands.ts # Command deployment script
├── dist/                 # Compiled JavaScript (generated)
├── .env                  # Environment variables (create from .env.example)
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. User invokes the `/fcroute` command
2. Bot presents a modal with input fields
3. User submits the form with route parameters
4. Bot sends a request to the Spansh API to calculate the route
5. Bot polls the API until the route calculation is complete
6. Bot displays formatted route information with an embed

## API Reference

This bot uses the Spansh Fleet Carrier Router API:
- **Endpoint**: `https://spansh.co.uk/api/fleetcarrier/search`
- **Method**: POST
- **Response**: Job ID for async route calculation

## Troubleshooting

### Bot doesn't respond to commands
- Ensure the bot is online and has proper permissions
- Run `npm run deploy-commands` to register commands
- Wait up to 1 hour for global commands to propagate (or register guild-specific commands for instant updates)

### "Invalid system name" errors
- Double-check system names for typos
- System names are case-insensitive but must match exactly
- Some systems may not be in the Spansh database

### Route calculation timeout
- Very long routes may take longer to calculate
- Check your internet connection
- Verify the Spansh API is online at https://spansh.co.uk/

## Contributing

Feel free to submit issues or pull requests to improve the bot!

## License

MIT License

## Credits

- **Spansh.co.uk** - For providing the excellent Fleet Carrier routing API
- **CATS** (Carrier Administration and Traversal System) - For API integration reference
- **Discord.js** - For the Discord bot framework

## Disclaimer

This is an unofficial third-party tool and is not affiliated with Frontier Developments or Elite Dangerous. Use at your own risk.
