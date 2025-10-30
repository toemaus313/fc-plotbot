# Quick Start Guide

## Initial Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Discord Bot

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Give it a name (e.g., "FC Route Plotter")
4. Go to "Bot" tab → Click "Add Bot"
5. Under "Token" → Click "Reset Token" → Copy the token
6. Go to "OAuth2" tab → Copy the "Client ID"

### 3. Configure Bot

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and paste your values:
```
DISCORD_TOKEN=paste_your_bot_token_here
CLIENT_ID=paste_your_client_id_here
```

### 4. Invite Bot to Server

1. Go back to Discord Developer Portal
2. OAuth2 → URL Generator
3. Select scopes: `bot` and `applications.commands`
4. Select permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
5. Copy the generated URL and open it in browser
6. Select your server and authorize

### 5. Deploy Commands & Start

```bash
npm run build
npm run deploy-commands
npm start
```

## Using the Bot

1. Type `/fcroute` in any channel
2. Fill in the modal:
   - **Start System**: e.g., "Sol"
   - **Destination System**: e.g., "Colonia"  
   - **Capacity Used**: e.g., "0"
   - **Fuel**: e.g., "1000"
3. Submit and wait for the route!

## Example Systems to Test

- **Sol** → **Colonia** (22,000 LY)
- **Sol** → **Beagle Point** (65,000 LY)
- **Colonia** → **Sagittarius A*** (4,000 LY)

## Troubleshooting

### Commands not showing up?
- Wait 5-10 minutes (global commands can take time)
- Or register guild-specific commands (edit deploy-commands.ts)

### Bot offline?
- Check console for errors
- Verify DISCORD_TOKEN in .env
- Ensure bot has proper permissions in server

### API errors?
- Check system names for typos
- Verify internet connection
- Spansh API may be temporarily down

## Notes

- Route calculation can take 10-30 seconds for long routes
- Maximum cargo capacity is 25,000 tons
- Neutron stars in route are marked with ⭐
- Full route link is provided in the response
