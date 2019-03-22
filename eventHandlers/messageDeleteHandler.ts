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
			.setFooter(client.user.tag, client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('DARK_PURPLE')
		
		if(message.content.length > 1024) 
			embed.setDescription(`\u25baMessage\n\`${message.content}\``)
			.addField(`\u200B`,
				`\u25baChannel : <#${message.channel.id}>\n` +
				`\u25baCreated : ${message.createdAt}\n` +
				`\u25baID : ${message.id}`)
		else 
			embed.setDescription(
				`\u25baMessage : \`${message.content}\`\n` +
				`\u25baChannel : <#${message.channel.id}>\n` +
				`\u25baCreated : ${message.createdAt.toISOString()}\n` +
				`\u25baID : ${message.id}`)

		log.send(`Message was deleted in <#${message.channel.id}>`, embed)
	})
}