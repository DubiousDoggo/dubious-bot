import { GuildMember, RichEmbed } from "discord.js"
import { DubiousBot, LoggerChannel } from ".."

export const guildMemberAddHandler = async (member: GuildMember, client: DubiousBot): Promise<void> => {

	const config = client.fetchConfig(member.guild)
	if (!config.enableLogger)
		return

	const logChannel = await client.fetchLogChannel(member.guild, LoggerChannel.user_join)

	const embed = new RichEmbed()
		.setAuthor(member.user.tag, member.user.avatarURL)
		.setTitle('User has joined')
		.setFooter(client.user.username, client.user.avatarURL)
		.setTimestamp(new Date())
		.setColor('AQUA')
		.setDescription(
			`\u25baName: ${member.user.tag}\n` +
			`\u25baJoined: ${member.joinedAt.toUTCString()}`)

	logChannel.send(`${member.user.tag} has joined`, embed)
}
