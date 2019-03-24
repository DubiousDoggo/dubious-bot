import { GuildMember, RichEmbed, TextChannel } from "discord.js";
import { DubiousBot } from "..";

export default async (member: GuildMember, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		let config = client.configs.get(member.guild.id)
		if (config === undefined)
			return reject(`No config file exist for server ${member.guild.id}`)
		if (!config.enableLogger)
			return resolve()

		let log = member.guild.channels.get(config.loggerChannelID)

		if (!(log instanceof TextChannel))
			return reject(`logger channel does not exist for guild ${member.guild.id}`)
	
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
	})
}