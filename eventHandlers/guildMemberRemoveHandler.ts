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
					.setTitle('User has left or been kicked')
					.setFooter(client.user.tag, client.user.avatarURL)
					.setTimestamp(new Date())
					.setColor('RED')
					.setDescription(
						`\u25baName: ${member.user.tag}\n` +
						`\u25baJoined: ${member.joinedAt.toUTCString()}\n` +
						`\u25baRoles: ${member.roles.map(role => role.name).join(', ')}`)

				log.send(`${member.user.tag} has left`, embed)
			}, type => logger.error(`${type} log channel is not set for ${member.guild.id}!`))
	})
}
