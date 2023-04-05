import { failEmbed, Subcommand, successEmbed } from 'cheesyutils.js';
import { ChatInputCommandInteraction, CacheType, inlineCode, APIEmbedField } from 'discord.js';

export class RoleReplaceCommand extends Subcommand {
    constructor() {
        super('modify', 'Modifies the roles of a given member');
        this.data
            .addUserOption(opt => opt
                .setName('member')
                .setDescription('The member to modify the role of')
                .setRequired(true),
            )
            .addRoleOption(opt => opt
                .setName('remove')
                .setDescription('The role to remove')
                .setRequired(false),
            )
            .addRoleOption(opt => opt
                .setName('add')
                .setDescription('The role to add')
                .setRequired(false),
            );
    }

    override async invoke(ctx: ChatInputCommandInteraction<CacheType>) {
        if (!ctx.inCachedGuild()) {
            return;
        }

        // Need to have a member, and at least a role to add or a role to remove
        const member = ctx.options.getMember('member');
        const remove = ctx.options.getRole('remove', false);
        const add = ctx.options.getRole('add', false);

        if (!member) {
            await ctx.reply({
                embeds: [
                    failEmbed({
                        message: 'That user is not a member of the guild',
                    }),
                ],
                ephemeral: true,
            });
            return;
        }

        if (!remove && !add) {
            await ctx.reply({
                embeds: [
                    failEmbed({
                        message: 'Must supply either a role to add or a role to remove',
                    }),
                ],
                ephemeral: true,
            });
            return;
        }

        let roles = Array.of(...member.roles.cache.clone().values());
        const fields: APIEmbedField[] = [];
        if (add) {
            roles.push(add);
            fields.push({
                name: 'Added',
                value: `${add.name.toString()} (${inlineCode(add.id)})`,
            });
        }

        if (remove) {
            roles = roles.filter(role => role.id !== remove.id);
            fields.push({
                name: 'Removed',
                value: `${remove.toString()} (${inlineCode(remove.id)})`,
            });
        }

        await member.roles.set(roles);

        await ctx.reply({
            embeds: [
                successEmbed({ message: `Modified roles for ${member.toString()}` }).setFields(fields),
            ],
        });
    }
}
