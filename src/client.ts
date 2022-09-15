import { CacheType, Client, GatewayIntentBits, Interaction } from 'discord.js';
import { commandListener, updateCommands } from './commands';

const client = new Client({
    allowedMentions: {
        parse: ['users'],
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
    presence: {
        status: 'idle',
    },
});

client.once('ready', async () => {
    console.log('Ready');
    await updateCommands(client);
});

client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
    if (interaction.isChatInputCommand()) {
        await commandListener.process(interaction);
    }
});

export { client };
