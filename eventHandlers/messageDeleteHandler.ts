import { Attachment, Message, RichEmbed, TextChannel, Util } from "discord.js";
import { DubiousBot } from "..";

export default async (message: Message, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		const config = client.fetchConfig(message.guild)
		if (!config.enableLogger)
			return resolve()

		const log = message.guild.channels.get(config.loggerChannelID)

		if (!(log instanceof TextChannel))
			return reject(`logger channel does not exist for guild ${message.guild.id}`)

		const embed = new RichEmbed()
			.setAuthor(message.author.tag, message.author.avatarURL)
			.setTitle('Message was deleted')
			.setFooter(client.user.username, client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('DARK_PURPLE')
			.setDescription(
				`\u25baMessage : \`${Util.escapeMarkdown(message.content, false, true)} \`\n` +
				`\u25baChannel : <#${message.channel.id}>\n` +
				`\u25baID : ${message.id}\n` +
				`\u25baSent : ${message.createdAt.toUTCString()}`)

		if (message.attachments.size)
			embed.description += `\n\u25baAttachments : ${message.attachments.map(attach => `[${attach.filename}](${attach.proxyURL})`).join(', ')}`

		if (message.embeds.some(embed => embed.type === 'rich'))
			embed.description += `\n\u25baRichEmbeds : ${message.embeds.filter(embed => embed.type === 'rich').length}`

		return log.send(`Message was deleted in <#${message.channel.id}>`, {
			embed: embed,
			files: message.attachments.map(attach => new Attachment(attach.proxyURL, attach.filename)),
		}).catch(error => {
			// fallback for uncached files
			if (error.status !== 404)
				throw error;
			return log.send(`Message was deleted in <#${message.channel.id}>`, embed)
		}).then(_reply => {
			return Promise.all(message.embeds
				.filter(embed => embed.type === 'rich')
				.map(embed => log.send(`Embed ${message.id}`, new RichEmbed(embed))))
		})
	})
}