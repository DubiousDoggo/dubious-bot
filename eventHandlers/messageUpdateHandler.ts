import { Message, RichEmbed } from "discord.js";
import { DubiousBot, logger } from "..";
import { escapeTicks } from "../src/utils";

export default async (message: Message, newmessage: Message, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		if (newmessage.author === client.user)
			return resolve()

		const config = client.fetchConfig(message.guild)
		if (!config.enableLogger)
			return resolve()

		return client.fetchLogChannel(message.guild, 'message')
			.then(log => {
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

				return log.send(`Message was updated in <#${message.channel.id}>`, embed)

			}, type => logger.error(`${type} log channel is not set for ${message.guild.id}!`))
	})
}