import { Message, MessageEmbed, PartialMessage } from "discord.js"
import { DubiousBot, logger, LoggerChannel } from ".."
import { escapeTicks } from "../src/utils"


export const messageUpdateHandler = async (oldmessage: Message | PartialMessage, newmessage: Message | PartialMessage, client: DubiousBot): Promise<void> => {

    if (newmessage.author === client.user) {
        return // dont log updates sent by the bot, that would cause another update!
    }

    const message = await newmessage.fetch()
    if (message.guild === null) {
        logger.info(`message ${message.id} updated with null guild`)
        return
    }

    const config = client.fetchConfig(message.guild)
    if (!config.enableLogger)
        return

    if (newmessage.content === oldmessage.content) {
        if (newmessage.embeds.length > oldmessage.embeds.length) {
            return // only log when embeds are deleted, not added
        }
        logger.debug(`message edit ${oldmessage.id} looks the same!`)
    }

    const logChannel = await client.fetchLogChannel(message.guild, LoggerChannel.messageUpdate, message.author.id)

    const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL() ?? undefined)
        .setTitle('Message was updated')
        .setFooter(client.user?.username, client.user?.avatarURL() ?? undefined)
        .setTimestamp(new Date())
        .setColor('DARK_GOLD')
        .setDescription(
            `\u25baPreviously : ${escapeTicks(oldmessage.content ?? 'undefined')}\n` +
            `\u25baNow : \`${escapeTicks(newmessage.content ?? 'undefined')}\`\n` +
            `\u25baID : ${newmessage.id}`)

    logChannel.send(`Message was updated in <#${message.channel.id}>`, embed)

}
