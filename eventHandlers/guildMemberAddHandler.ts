import { GuildMember, RichEmbed, TextChannel } from "discord.js";
import { DubiousBot } from "..";

export default async (member: GuildMember, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		const config = client.fetchConfig(member.guild)
		if (!config.enableLogger)
			return resolve()

		const log = member.guild.channels.get(config.loggerChannelID)

		if (!(log instanceof TextChannel))
			return reject(`logger channel does not exist for guild ${member.guild.id}`)

		const embed = new RichEmbed()
			.setAuthor(member.user.tag, member.user.avatarURL)
			.setTitle('User has joined')
			.setFooter(client.user.username, client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('AQUA')
			.setDescription(
				`\u25baName: ${member.user.tag}\n` +
				`\u25baJoined: ${member.joinedAt.toUTCString()}`)

		return log.send(`${member.user.tag} has joined`, embed)
	})
}