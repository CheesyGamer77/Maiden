import { Client, GatewayIntentBits } from 'discord.js';

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

client.once('ready', () => console.log('Ready'));

export { client };
