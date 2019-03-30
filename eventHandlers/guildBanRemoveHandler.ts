import { Guild, RichEmbed, User } from "discord.js";
import { DubiousBot, logger } from "..";

export default async (guild: Guild, user: User, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		const config = client.fetchConfig(guild)
		if (!config.enableLogger)
			return resolve()

		return client.fetchLogChannel(guild, 'mod')
			.then(log => {
				const embed = new RichEmbed()
					.setAuthor(user.tag, user.avatarURL)
					.setTitle('User was unbanned')
					.setFooter(client.user.username, client.user.avatarURL)
					.setTimestamp(new Date())
					.setColor('DARK_GREEN')
					.setDescription(
						`\u25baName : ${user.tag}\n` +
						`\u25baID : ${user.id}`)

				return log.send(`${user.tag} was unbanned`, embed)
			}, type => logger.error(`${type} log channel is not set for ${guild.id}!`))
	})
}