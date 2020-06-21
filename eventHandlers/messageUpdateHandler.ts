import { Message, RichEmbed } from "discord.js"
import { DubiousBot, LoggerChannel, logger } from ".."
import { escapeTicks } from "../src/utils"


export const messageUpdateHandler = async (message: Message, newmessage: Message, client: DubiousBot): Promise<void> => {

    if (newmessage.author === client.user) {
        return // dont log updates sent by the bot, that would cause another update!
    }

    const config = client.fetchConfig(message.guild)
    if (!config.enableLogger) {
        return
    }

    if (newmessage.content === message.content) {
        if (newmessage.embeds.length > message.embeds.length) {
            return // only log when embeds are deleted, not added
        }
        logger.debug(`message edit ${message.id} looks the same!`)
    }

    const logChannel = await client.fetchLogChannel(message.guild, LoggerChannel.messageUpdate, message.author.id)

    const embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle('Message was updated')
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp(new Date())
        .setColor('DARK_GOLD')
        .setDescription(
            `\u25baPreviously : ${escapeTicks(message.content)}\n` +
            `\u25baNow : \`${escapeTicks(newmessage.content)}\`\n` +
            `\u25baID : ${newmessage.id}`)

    logChannel.send(`Message was updated in <#${message.channel.id}>`, embed)

}
