import { RichEmbed } from "discord.js"
import fs from 'fs'
import { Command, fileEncoding, PermissionLevel } from ".."

export const status: Command = {
	name: 'status',
	alias: [],
	level: PermissionLevel.user,
	desc: 'Gives a list of things about the bot',
	usage: '',
	execute: async (message, args, _config, client) => {
		if (args.length > 0)
			throw Error(`Invalid argument ${args[0]}`)

		const embed = new RichEmbed()
			.setTitle('Bot Status')
			.setThumbnail(client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('BLUE')
			.addField('Servers Joined', client.guilds.size, true)
			.addField('Ping', `${client.ping}ms`, true)
			.addField('Uptime', new Date(Date.now() - client.uptime).toUTCString(), true)
			.addField('Version', JSON.parse(fs.readFileSync('../package.json', fileEncoding)).version)
		message.channel.send(embed)
	}
}
