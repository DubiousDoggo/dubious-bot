import { Attachment, Message, RichEmbed } from "discord.js";
import { DubiousBot, logger } from "..";
import { escapeTicks } from "../src/utils";

export default async (message: Message, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		const config = client.fetchConfig(message.guild)
		if (!config.enableLogger)
			return resolve()

		return client.fetchLogChannel(message.guild, 'message')
			.then(log => {
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

				if (message.attachments.size)
					embed.description += `\n\u25baAttachments : ${message.attachments.map(attach => `[${attach.filename}](${attach.proxyURL})`).join(', ')}`

				if (message.embeds.some(embed => embed.type === 'rich'))
					embed.description += `\n\u25baRichEmbeds : ${message.embeds.filter(embed => embed.type === 'rich').length}`

				return log.send(`Message was deleted in <#${message.channel.id}>`, {
					embed: embed,
					files: message.attachments.map(attach => new Attachment(attach.proxyURL, attach.filename))
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
			}, type => logger.error(`${type} log channel is not set for ${message.guild.id}!`))
	})
}