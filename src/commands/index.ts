import { Client } from 'discord.js';
import { CommandListener } from './internal';
import { MessageDownloadCommand } from './message';
import { WebhooksCommand } from './misc/webhooks';

export const commandListener = new CommandListener(
    new MessageDownloadCommand(),
    new WebhooksCommand()
);

export async function updateCommands(client: Client) {
    const commands = commandListener.getCommands();

    await client.application?.commands.set(commands);

    console.log(`Updated ${commands.length} commands`);
}
