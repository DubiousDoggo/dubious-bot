import { Message, RichEmbed, TextChannel } from "discord.js";
import { DubiousBot } from "..";

export default async (message: Message, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
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
			.setTitle('Message was deleted')
			.setFooter(client.user.username, client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('DARK_PURPLE')
			.setDescription(
				`\u25baMessage : \`${message.content}\`\n` +
				`\u25baChannel : <#${message.channel.id}>\n` +
				`\u25baID : ${message.id}\n` +
				`\u25baSent : ${message.createdAt.toUTCString()}`)

		log.send(`Message was deleted in <#${message.channel.id}>`, embed)
	})
}