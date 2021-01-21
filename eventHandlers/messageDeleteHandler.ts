import { Message, MessageEmbed, PartialMessage } from "discord.js"
import { DubiousBot, logger, LoggerChannel } from ".."
import { escapeTicks } from "../src/utils"

export const messageDeleteHandler = async (message: Message | PartialMessage, client: DubiousBot): Promise<void> => {

    if (message.guild === null) {
        logger.error(`deleted message ${message.id} has null guild`)
        return
    }

    const config = client.fetchConfig(message.guild)
    if (!config.enableLogger)
        return

    const logChannel = await client.fetchLogChannel(message.guild, LoggerChannel.messageDelete, message.author?.id)

    const embed = new MessageEmbed()
        .setAuthor(message.author?.tag, message.author?.avatarURL() ?? undefined)
        .setTitle('Message was deleted')
        .setFooter(client.user?.username, client.user?.avatarURL() ?? undefined)
        .setTimestamp(new Date())
        .setColor('DARK_PURPLE')
        .setDescription(
            `\u25baMessage : ${escapeTicks(message.content ?? '')}\n` +
            `\u25baChannel : <#${message.channel.id}>\n` +
            `\u25baID : ${message.id}\n` +
            `\u25baSent : ${message.createdAt.toUTCString()}`)

}
