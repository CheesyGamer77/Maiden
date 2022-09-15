import { Buffer } from 'node:buffer';
import {
    AttachmentBuilder,
    CacheType,
    ChannelType,
    ChatInputCommandInteraction,
    Colors,
    GuildTextBasedChannel,
    PermissionFlagsBits,
} from 'discord.js';
import { PermissionLockedSlashCommand } from '../internal/slash';

/**
 * Lists all webhooks in a given channel
 */
export class WebhooksCommand extends PermissionLockedSlashCommand {
    constructor() {
        super('webhooks', 'Lists all webhooks for a given channel', PermissionFlagsBits.ManageWebhooks);

        this.dataBuilder.addChannelOption(opt => opt
            .setName('channel')
            .setDescription('The channel to list the webhooks of')
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice),
        );
    }

    override async invoke(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const channel = (interaction.options.getChannel(
            'channel', false,
            ) ?? interaction.channel) as GuildTextBasedChannel;

        if (channel === null) {
            await interaction.reply({
                embeds: [{
                    description: ':x: Well this is awkward... the channel provided is null',
                    color: Colors.Red,
                }],
                ephemeral: true,
            });
            return;
        }

        if (channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildVoice) {
            await interaction.reply({
                embeds: [{
                    description: ':x: Can only list webhooks of channels of type `GUILD_TEXT` OR `GUILD_VOICE`',
                    color: Colors.Red,
                }],
                ephemeral: true,
            });
            return;
        }

        const webhooks = await channel.fetchWebhooks();

        let bufferString = '';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, webhook] of webhooks) {
            bufferString = bufferString.concat(`Name: ${webhook.name}\nID: ${webhook.id}\nURL: ${webhook.url}\n\n`);
        }
        bufferString = bufferString.trim();

        if (webhooks.size === 0) {
            await interaction.reply({
                embeds: [{
                    description: ':shrug: No webhooks to show',
                    color: Colors.Gold,
                }],
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                embeds: [{
                    description: `:white_check_mark: Showing ${webhooks.size} total webhooks in ${channel.toString()}`,
                    color: Colors.Green,
                }],
                ephemeral: true,
                files: [
                    new AttachmentBuilder(Buffer.from(bufferString), { name: `webhooks-${channel.id}.txt` }),
                ],
            });
        }
    }
}
