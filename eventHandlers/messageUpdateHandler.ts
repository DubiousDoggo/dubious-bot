import { Message, TextChannel, RichEmbed } from "discord.js";
import { DubiousBot } from "..";

export default async (message: Message, newmessage: Message, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		if (newmessage.author === client.user)
			return resolve()

		let config = client.configs.get(message.guild.id)
		if (config === undefined)
			return reject(`No config file exist for server ${message.guild.id}`)
		if (!config.enableLogger)
			return resolve()

		let log = message.guild.channels.get(config.loggerChannelID)

		if (!(log instanceof TextChannel))
			return reject(`logger channel does not exist for guild ${message.guild.id}`)

		const embed = new RichEmbed()
			.setAuthor(message.author.tag, message.author.avatarURL)
			.setTitle('Message was updated')
			.setFooter(client.user.username, client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('DARK_GOLD')
			.setDescription(
				`\u25baPreviously : \`${message.content}\`\n` +
				`\u25baNow : \`${newmessage.content}\``)

		return log.send(`Message was updated in <#${message.channel.id}>`, embed)
	})
}