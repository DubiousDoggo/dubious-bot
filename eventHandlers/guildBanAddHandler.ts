import { Guild, RichEmbed, TextChannel, User } from "discord.js";
import { DubiousBot } from "..";

export default async (guild: Guild, user: User, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		const config = client.fetchConfig(guild)
		if (!config.enableLogger)
			return resolve()

		const log = guild.channels.get(config.loggerChannelID)

		if (!(log instanceof TextChannel))
			return reject(`logger channel does not exist for guild ${guild.id}`)

		const embed = new RichEmbed()
			.setAuthor(user.tag, user.avatarURL)
			.setTitle('User was banned')
			.setFooter(client.user.username, client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('DARK_RED')
			.setDescription(
				`\u25baName : ${user.tag}\n` +
				`\u25baID : ${user.id}`)
		
		return log.send(`${user.tag} was banned`, embed)
	})
}