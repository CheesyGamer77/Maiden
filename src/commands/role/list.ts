import { Buffer } from 'node:buffer';
import { Subcommand } from 'cheesyutils.js';
import { ChatInputCommandInteraction, CacheType, AttachmentBuilder, EmbedBuilder, Colors } from 'discord.js';

export class RoleListCommand extends Subcommand {
    constructor() {
        super('list', 'Lists all the roles in the guild');
    }

    override async invoke(ctx: ChatInputCommandInteraction<CacheType>): Promise<void> {
        if (!ctx.inCachedGuild()) {
            return;
        }

        const guild = ctx.guild;
        const roles = guild.roles.cache;

        let bufferString = '';
        for (const [id, role] of roles) {
            bufferString += `${role.name} - ${id}\n`;
        }
        bufferString = bufferString.trim();

        await ctx.reply({
            embeds: [new EmbedBuilder()
                .setDescription(`:white_check_mark: Showing ${roles.size} total roles`)
                .setColor(Colors.Green),
            ],
            files: [
                new AttachmentBuilder(Buffer.from(bufferString, 'utf-8'), { name: `roles-${guild.id}.txt` }),
            ],
        });
    }
}
