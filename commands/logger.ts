import { Command } from "..";

export default {
	name: 'logger',
	alias: ['log'],
	level: 'dev',
	desc: 'Enables or disables the logger.',
	usage: '[enable/disable]',
	execute: async (message, args, config, client) => {
		return new Promise<void>((resolve, reject) => {
			if(args.length <= 0) {
				message.channel.send(`The logger is currently ${config.enableLogger ? 'enabled' : 'disabled'}.`)
				return resolve()
			}
			if(args[0] !== 'enable' && args[0] !== 'disable')
				return reject()
			
			if(args[0] === 'enable' && !message.guild.channels.has(config.loggerChannelID) )
				return reject('No channel set for logging')

			config.enableLogger = (args[0] === 'enable')
			client.saveConfig(message.guild.id)

			return resolve()
		})
	}
} as Command