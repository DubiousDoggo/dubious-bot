import { Command } from "..";

export default {
	name: 'setlog',
	alias: ['set'],
	level: 'dev',
	desc: 'Sets the channel for logging information.',
	usage: '',
	execute: async (message, args, config, client) => {
		return new Promise<void>((resolve, reject) => {
			if(args.length > 0)
				return reject('Too many arguments')
			
			config.loggerChannelID = message.channel.id
			client.saveConfig(message.guild.id)

			return resolve()
		})
	}
} as Command