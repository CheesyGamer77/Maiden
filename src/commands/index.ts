import { Client } from 'discord.js';
import { CommandListener } from './internal';
import { MessageDownloadCommand } from './message';

export const commandListener = new CommandListener(
    new MessageDownloadCommand(),
);

export async function updateCommands(client: Client) {
    const commands = commandListener.getCommands();

    await client.application?.commands.set(commands);

    console.log(`Updated ${commands.length} commands`);
}
