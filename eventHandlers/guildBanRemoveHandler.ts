import { Guild, RichEmbed, User } from "discord.js"
import { DubiousBot } from ".."

export const guildBanRemoveHandler = async (guild: Guild, user: User, client: DubiousBot): Promise<void> => {

	const config = client.fetchConfig(guild)
	if (!config.enableLogger) return

	const logChannel = await client.fetchLogChannel(guild, 'mod')

	const embed = new RichEmbed()
		.setAuthor(user.tag, user.avatarURL)
		.setTitle('User was unbanned')
		.setFooter(client.user.username, client.user.avatarURL)
		.setTimestamp(new Date())
		.setColor('DARK_GREEN')
		.setDescription(
			`\u25baName : ${user.tag}\n` +
			`\u25baID : ${user.id}`)

	logChannel.send(`${user.tag} was unbanned`, embed)
}
