import { CommandInteraction } from 'discord.js';
import { SlashCommand } from './slash';

export class CommandListener {
    private readonly commandMap: Map<string, SlashCommand> = new Map();

    constructor(...commands: SlashCommand[]) {
        for (const command of commands) {
            this.commandMap.set(command.getName(), command);
        }
    }

    getCommands() {
        const data = [];

        for (const cmd of this.commandMap.values()) {
            data.push(cmd.toJSON());
        }

        return data;
    }

    async process(interaction: CommandInteraction) {
        if (interaction.isChatInputCommand()) {
            await this.commandMap.get(interaction.commandName)?.process(interaction);
        }
    }
}
