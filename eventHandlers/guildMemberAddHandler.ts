import { GuildMember, RichEmbed, TextChannel } from "discord.js";
import { DubiousBot, logger } from "..";

export default async (member: GuildMember, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		const config = client.fetchConfig(member.guild)
		if (!config.enableLogger)
			return resolve()

		client.fetchLogChannel(member.guild, 'join')
			.then(log => {
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
			}, type => logger.error(`${type} log channel is not set for ${member.guild.id}!`))
	})
}