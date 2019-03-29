import { RichEmbed } from "discord.js";
import { Command } from "..";

export default {

	name: 'status',
	alias: [],
	level: 'user',
	desc: 'Gives a list of things about the bot',
	usage: '',
	execute: async (message, args, _config, client) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length > 0)
				return reject(`Invalid argument ${args[0]}`)

			const embed = new RichEmbed()
				.setTitle('Bot Status')
				.setThumbnail(client.user.avatarURL)
				.setTimestamp(new Date())
				.setColor('BLUE')
				.addField('Servers Joined', client.guilds.size, true)
				.addField('Ping', `${client.ping}ms`, true)
				.addField('Launched', new Date(Date.now() - client.uptime).toUTCString(), true)
			message.channel.send(embed)
			return resolve()
		})
	}
} as Command