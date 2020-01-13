import { RichEmbed } from "discord.js"
import fs from 'fs'
import { Command, fileEncoding, PermissionLevel } from ".."
import { InvalidArgumentError } from "../src/Errors"

export default <Command>{
	name: 'status',
	alias: [],
	level: PermissionLevel.user,
	desc: 'Gives a list of things about the bot',
	usage: '',
	execute: async (message, args, _config, client) => {
		if (args.length > 0)
			throw new InvalidArgumentError(args[0])

		const embed = new RichEmbed()
			.setTitle('Bot Status')
			.setThumbnail(client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('BLUE')
			.addField('Servers', client.guilds.size, true)
			.addField('Ping', `${client.ping}ms`, true)
			.addField('Uptime', `${client.uptime}ms`, true)
			.addField('Version', JSON.parse(fs.readFileSync('./package.json', fileEncoding)).version)
		message.channel.send(embed)
	}
}
