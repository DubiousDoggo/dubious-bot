import { Attachment, Message, RichEmbed } from "discord.js"
import { DubiousBot, LoggerChannel } from ".."
import { escapeTicks } from "../src/utils"

export const messageDeleteHandler = async (message: Message, client: DubiousBot): Promise<void> => {

    const config = client.fetchConfig(message.guild)
    if (!config.enableLogger)
        return

    const logChannel = await client.fetchLogChannel(message.guild, LoggerChannel.messageDelete, message.author.id)

    const embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle('Message was deleted')
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp(new Date())
        .setColor('DARK_PURPLE')
        .setDescription(
            `\u25baMessage : ${escapeTicks(message.content)}\n` +
            `\u25baChannel : <#${message.channel.id}>\n` +
            `\u25baID : ${message.id}\n` +
            `\u25baSent : ${message.createdAt.toUTCString()}`)

    if (message.embeds.some(embed => embed.type === 'rich'))
        embed.description += `\n\u25baRichEmbeds : ${message.embeds.filter(embed => embed.type === 'rich').length}`

    if (message.attachments.size)
        embed.addField('Attachments', message.attachments.map(attachment => `[${attachment.filename}](${attachment.proxyURL})`).join('\n'))

    logChannel.send(`Message was deleted in <#${message.channel.id}>`, {
        embed: embed,
        files: message.attachments.map(attachment => new Attachment(attachment.proxyURL, attachment.filename))
    }).catch(error => {
        // fallback for uncached files
        if (error.status !== 404) throw error
        return logChannel.send(`Message was deleted in <#${message.channel.id}>`, embed)
    }).then(_ => Promise.all(message.embeds
        .filter(embed => embed.type === 'rich')
        .map(embed => logChannel.send(`Embed on deleted message \`${message.id}\``, new RichEmbed(embed))))
    )
}
