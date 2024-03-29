import { Buffer } from 'node:buffer';
import { Subcommand, successEmbed } from 'cheesyutils.js';
import { AttachmentBuilder, Colors, ChatInputCommandInteraction, CacheType, Role } from 'discord.js';
import { intersection, union } from './setUtils';
import { Maiden } from '../../Maiden';

export class RoleCompareMembersCommand extends Subcommand {
    constructor() {
        super('compare-members', 'Compares two roles in terms of their members');
        this.data
            .addRoleOption(opt => opt
                .setName('parent')
                .setDescription('The source role')
                .setRequired(true),
            )
            .addRoleOption(opt => opt
                .setName('child')
                .setDescription('The other role')
                .setRequired(true),
            );
    }

    override async invoke(ctx: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const guild = ctx.guild;
        if (guild === null) {
            return;
        }

        await ctx.deferReply();

        const parent = ctx.options.getRole('parent', true) as Role;
        const child = ctx.options.getRole('child', true) as Role;

        const parentMembers = await Maiden.fetchMembersWithRole(guild, parent);
        const childMembers = await Maiden.fetchMembersWithRole(guild, child);

        // TODO: use discord.js Collection operations
        const parentSet = new Set(parentMembers);
        const childSet = new Set(childMembers);

        let bufferString = '';

        const total = union(parentSet, childSet);
        const both = intersection(parentSet, childSet);

        bufferString = bufferString.concat(`----- ${total.size} Total Members -----\n`);
        for (const [id, member] of total) {
            bufferString = bufferString.concat(
                `Tag: ${member.user.tag}\nNick: ${member.nickname ?? member.user.username}\nID: ${id}\n\n`,
            );
        }

        bufferString = bufferString.concat(`----- ${both.size} Members with Both Roles -----\n`);
        for (const [id, member] of both) {
            bufferString = bufferString.concat(
                `Tag: ${member.user.tag}\nNick: ${member.nickname ?? member.user.username}\nID: ${id}\n\n`,
            );
        }

        bufferString = bufferString.trim();

        await ctx.editReply({
            embeds: [successEmbed({
                message: `Comparing members for roles ${parent.toString()} and ${child.toString()}`,
            }).addFields({
                name: 'Total Members',
                value: `${total.size} (${both.size} with both roles)`,
            })],
            files: [
                new AttachmentBuilder(Buffer.from(bufferString, 'utf-8'),
                    { name: `role-members-${parent.id}-${child.id}.txt` },
                ),
            ],
        });
    }
}
