import { Message, RichEmbed } from "discord.js"
import { DubiousBot, LoggerChannel } from ".."
import { escapeTicks } from "../src/utils"

export const messageUpdateHandler = async (message: Message, newmessage: Message, client: DubiousBot): Promise<void> => {

	if (newmessage.author === client.user)
		return

	const config = client.fetchConfig(message.guild)
	if (!config.enableLogger) return

	const logChannel = await client.fetchLogChannel(message.guild, LoggerChannel.message_update)

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
