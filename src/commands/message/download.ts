import { Buffer } from 'node:buffer';
import { AttachmentBuilder, ChatInputCommandInteraction, CacheType, Colors, inlineCode, Message } from 'discord.js';
import { Maiden } from '../../Maiden';
import { SlashCommand } from '../internal/slash';

/**
 * Downloads the JSON data of a particular Discord message.
 */
export class MessageDownloadCommand extends SlashCommand {
    constructor() {
        super('download', 'Returns a JSON file of a message\'s data');

        this.dataBuilder.addStringOption(arg => arg
            .setName('url')
            .setDescription('Discord Message URL')
            .setRequired(true)
            .setMaxLength(150),
        );
    }

    override async invoke(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const arg = interaction.options.getString('url', true);

        let message: Message | undefined;
        let [guildId, channelId, messageId] = '?';
        try {
            [guildId, channelId, messageId] = arg
                .replace(/(?:https?:\/\/)?(?:\w+\.)?discord\.com\/channels\//g, '')
                .split('/');

            const guild = Maiden.client.guilds.cache.get(guildId);
            const channel = guild?.channels.cache.get(channelId);
            if (channel?.isTextBased()) {
                message = await channel.messages.fetch(messageId);
            } else {
                await interaction.reply({
                    embeds: [{
                        description: ':x: Can only download messages from text-based channels',
                        color: Colors.Red,
                    }],
                    ephemeral: true,
                });
                return;
            }
        } catch (e) {
            await interaction.reply({
                embeds: [{
                    description: `:x: Couldn't download message with url ${inlineCode(arg)}}`,
                    color: Colors.Red,
                }],
                ephemeral: true,
            });
            return;
        }

        if (message) {
            await interaction.reply({
                embeds: [{
                    description: ':white_check_mark: Message JSON data attached',
                    color: Colors.Green,
                }],
                files: [
                    new AttachmentBuilder(Buffer.from(JSON.stringify(message.toJSON(), undefined, 4)), {
                        name: `message-${messageId}.json`,
                    }),
                ],
            });
        } else {
            await interaction.reply({
                embeds: [{
                    description: ':x: Well this is awkward... Something went wrong',
                    color: Colors.Red,
                    fields: [{
                        name: 'Parsed Message Data',
                        value: `Guild: ${guildId}\nChannel: ${channelId}\nMessage: ${messageId}`,
                    }],
                }],
                ephemeral: true,
            });
        }
    }
}
