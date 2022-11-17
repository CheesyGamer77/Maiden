import { CommandListener } from 'cheesyutils.js';
import { Client } from 'discord.js';
import { MessageDownloadCommand } from './message';
import { WebhooksCommand } from './misc/webhooks';
import { RoleCommands } from './role';


export const commandListener = new CommandListener(
    new MessageDownloadCommand(),
    new RoleCommands(),
    new WebhooksCommand(),
);

export async function updateCommands(client: Client) {
    const commands = commandListener.getCommands();

    await client.application?.commands.set(commands);

    console.log(`Updated ${commands.length} commands`);
}
