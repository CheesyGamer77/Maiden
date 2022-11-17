import { Buffer } from 'node:buffer';
import { failEmbed, SlashCommand, successEmbed } from 'cheesyutils.js';
import { APIEmbedAuthor, APIEmbedField, APIEmbedFooter, APIEmbedImage } from 'discord-api-types/v10';
import { AttachmentBuilder, ChatInputCommandInteraction, CacheType, inlineCode, Message } from 'discord.js';
import { Maiden } from '../../Maiden';

type MinimalEmbedData = {
    author?: APIEmbedAuthor
    title?: string,
    description?: string
    color?: number,
    image?: APIEmbedImage,
    fields?: APIEmbedField[],
    footer?: APIEmbedFooter,
    timestamp?: string
}

/**
 * Downloads the JSON data of a particular Discord message.
 */
export class MessageDownloadCommand extends SlashCommand {
    constructor() {
        super('download', 'Returns a JSON file of a message\'s data');

        this.data.addStringOption(arg => arg
            .setName('url')
            .setDescription('Discord Message URL')
            .setRequired(true)
            .setMaxLength(150),
        );
    }

    private filterMessageData(message: Message) {
        const embeds: MinimalEmbedData[] = [];

        for (const embed of message.embeds) {
            embeds.push({
                author: embed.author ?? undefined,
                title: embed.title ?? undefined,
                description: embed.description ?? undefined,
                color: embed.color ?? undefined,
                image: embed.image ?? undefined,
                fields: embed.fields.length > 0 ? embed.fields : undefined,
                footer: embed.footer ?? undefined,
                timestamp: embed.timestamp ?? undefined,
            });
        }

        return {
            content: message.content !== '' ? message.content : null,
            embeds: embeds.length > 0 ? embeds : null,
            attachments: message.attachments,
        };
    }

    override async invoke(ctx: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const arg = ctx.options.getString('url', true);

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
                await ctx.reply({
                    embeds: [failEmbed({
                        message: 'Can only download messages from text-based channels',
                    })],
                    ephemeral: true,
                });
                return;
            }
        } catch (e) {
            await ctx.reply({
                embeds: [failEmbed({
                    message: `Couldn't download message with url ${inlineCode(arg)}`,
                })],
                ephemeral: true,
            });
            return;
        }

        if (message) {
            await ctx.reply({
                embeds: [successEmbed({
                    message: 'Message JSON data attached',
                })],
                files: [
                    new AttachmentBuilder(Buffer.from(JSON.stringify(this.filterMessageData(message), undefined, 4)), {
                        name: `message-${messageId}.json`,
                    }),
                ],
            });
        } else {
            await ctx.reply({
                embeds: [
                    failEmbed({
                        message: 'Well this is awkward... Something went wrong',
                    }).addFields({
                        name: 'Parsed Message Data',
                        value: `Guild: ${guildId}\nChannel: ${channelId}\nMessage: ${messageId}`,
                    })],
                ephemeral: true,
            });
        }
    }
}
