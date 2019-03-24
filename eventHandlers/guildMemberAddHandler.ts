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
			.setTitle('User has joined')
			.setDescription(
				`\u25baName: ${member.user.tag}\n` +
				`\u25baJoined: ${member.joinedAt.toUTCString()}`)
			.setFooter(client.user.tag, client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('AQUA')
		
		log.send(`${member.user.tag} has joined`, embed)
	})
}