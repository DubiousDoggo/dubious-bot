import { Guild, RichEmbed, User } from "discord.js"
import { DubiousBot } from ".."

export const guildBanAddHandler = async (guild: Guild, user: User, client: DubiousBot): Promise<void> => {

	const config = client.fetchConfig(guild)
	if (!config.enableLogger) return

	const logChannel = await client.fetchLogChannel(guild, 'mod')

	const embed = new RichEmbed()
		.setAuthor(user.tag, user.avatarURL)
		.setTitle('User was banned')
		.setFooter(client.user.username, client.user.avatarURL)
		.setTimestamp(new Date())
		.setColor('DARK_RED')
		.setDescription(
			`\u25baName : ${user.tag}\n` +
			`\u25baID : ${user.id}`)

	logChannel.send(`${user.tag} was banned`, embed)
}
