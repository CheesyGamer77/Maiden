import { SlashCommand } from 'cheesyutils.js';
import {
    ChatInputCommandInteraction,
    CacheType,
    EmbedBuilder,
    time,
    TimestampStyles,
    User,
    APIEmbedField,
    Guild,
    UserFlagsString,
    PermissionFlagsBits,
} from 'discord.js';

type FlagEmojiContainer = {
    name: string
    emoji: string
}

export class UserCommand extends SlashCommand {
    constructor() {
        super('user', 'Returns information about a user');
        this.data.addUserOption(opt => opt
                .setName('user')
            .setDescription('The user to retrieve information for')
            .setRequired(false),
        );
    }

    private async getUserFlagsField(user: User): Promise<APIEmbedField> {
        // TODO: This is dumb lol
        const flagsMap = new Map<UserFlagsString, FlagEmojiContainer>()
            .set('ActiveDeveloper', {
                name: 'Active Developer',
                emoji: '<:activedev:1081049360202223636>',
            })
            .set('BugHunterLevel1', {
                name: 'Bug Hunter Level 1',
                emoji: '<:bug_hunter1:848324246363045920>',
            })
            .set('BugHunterLevel2', {
                name: 'Bug Hunter Level 2',
                emoji: '<:bug_hunter2:848324259202072590>',
            })
            .set('CertifiedModerator', {
                name: 'Certified Moderator',
                emoji: '<:certified_moderator:848324273164779520>',
            })
            .set('Staff', {
                name: 'Discord Staff',
                emoji: '<:staff:848324432295624764>',
            })
            .set('VerifiedDeveloper', {
                name: 'Early Verified Bot Developer',
                emoji: '<:bot_developer:848342709877604372>',
            })
            .set('HypeSquadOnlineHouse1', {
                name: 'House of Bravery',
                emoji: '<:bravery:848324228725211217>',
            })
            .set('HypeSquadOnlineHouse2', {
                name: 'House of Brilliance',
                emoji: '<:brilliance:848324236291342348>',
            })
            .set('HypeSquadOnlineHouse3', {
                name: 'House of Balance',
                emoji: '<:balance:848324174145650689>',
            })
            .set('Hypesquad', {
                name: 'Hypesquad Events',
                emoji: '<:hypesquad_events:848324337055301683>',
            })
            .set('Partner', {
                name: 'Discord Partner',
                emoji: '<:partner:848324397164134400>',
            })
            .set('PremiumEarlySupporter', {
                name: 'Early Supporter',
                emoji: '<:early_supporter:848344299976523797>',
            });

            let flags = user.flags;
            if (!flags) {
                flags = await user.fetchFlags();
            }

        const lines = flags.toArray()
            .flatMap(flag => {
                const container = flagsMap.get(flag);
                return container ? container : [];
            })
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(container => `• ${container.emoji} ${container.name}`);

        let value = lines.join('\n');
        if (lines.length === 0) {
            value = 'None';
        }

        return {
            name: 'User Flags',
            value,
        };
    }

    private async getStatusField(user: User, guild: Guild): Promise<APIEmbedField> {
        const name = 'Status';

        // Check if the user is a member of the guild
        const member = guild.members.cache.find(u => u.id === user.id);
        if (member) {
            const state = member.pending ? 'Pending' : 'Joined';

            return {
                name,
                value: `${state} ${time(member.joinedAt ?? new Date(), TimestampStyles.ShortDateTime)}`,
            };
        }

        let value = 'Not Joined';

        if (guild.members?.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
            // eslint-disable-next-line no-empty-function
            try {
                const ban = await guild.bans.fetch(user.id);
                value = ban.reason ? `BANNED: ${ban.reason}` : 'BANNED';
            } catch (ignored) {
                return {
                    name,
                    value,
                };
            }
        }

        return {
            name,
            value,
        };
    }

    override async invoke(ctx: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const user = ctx.options.getUser('user', false) ?? ctx.user;

        const fields: APIEmbedField[] = [
            { name: 'Created', value: time(user.createdAt, TimestampStyles.ShortDateTime) },
            await this.getUserFlagsField(user),
        ];

        if (ctx.guild) {
            fields.push(await this.getStatusField(user, ctx.guild));
        }

        await ctx.reply({
            content: user.id,
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: user.tag, iconURL: user.avatarURL() ?? user.defaultAvatarURL })
                    .setTitle('User Info')
                    .setThumbnail(user.avatarURL())
                    .setColor(user.accentColor ?? null)
                    .addFields(fields)
                    .setFooter({ text: `User ID: ${user.id}` }),
            ],
        });
    }
}
