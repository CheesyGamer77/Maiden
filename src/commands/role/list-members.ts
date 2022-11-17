import { Buffer } from 'node:buffer';
import { Subcommand } from 'cheesyutils.js';
import { AttachmentBuilder, Colors, ChatInputCommandInteraction, CacheType, Role } from 'discord.js';
import { Maiden } from '../../Maiden';

export class RoleListMembersCommand extends Subcommand {
    constructor() {
        super('list-members', 'Lists all users with the given role');

        this.data.addRoleOption(opt => opt
            .setName('role')
            .setDescription('The role to list the members of')
            .setRequired(true),
        );
    }

    override async invoke(ctx: ChatInputCommandInteraction<CacheType>): Promise<void> {
        if (ctx.guild === null) {
            return;
        }

        const role = ctx.options.getRole('role', true) as Role;

        const members = await Maiden.fetchMembersWithRole(ctx.guild, role);

        let bufferString = '';
        for (const [id, member] of members ?? []) {
            bufferString = bufferString.concat(
                `Tag: ${member.user.tag}\nNick: ${member.nickname ?? member.user.username}\nID: ${id}\n\n`,
            );
        }
        bufferString = bufferString.trim();

        if (role.members.size === 0) {
            await ctx.reply({
                embeds: [{
                    description: `:shrug: There aren't any members with the ${role.toString()} role`,
                    color: Colors.Gold,
                }],
            });
        } else {
            await ctx.reply({
                embeds: [{
                    description: `:white_check_mark: Showing ${role.members.size} members with role ${role.toString()}`,
                    color: Colors.Green,
                }],
                files: [
                    new AttachmentBuilder(Buffer.from(bufferString, 'utf-8'), { name: `role-members-${role.id}.txt` }),
                ],
            });
        }
    }
}
