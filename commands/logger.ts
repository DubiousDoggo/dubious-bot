import { Command } from "..";

export default {
	name: 'logger',
	alias: ['log'],
	level: 'dev',
	desc: 'Enables or disables the logger.',
	usage: '[<enable|disable>]',
	execute: async (message, args, config, client) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length > 0) {
				if (args[0] !== 'enable' && args[0] !== 'disable')
					return reject(`Invalid argument ${args[0]}`)
				if (args.length > 1)
					return reject(`Invalid argument ${args[1]}`)
			}

			if (args.length === 0) {
				message.channel.send(`The logger is currently ${config.enableLogger ? 'enabled' : 'disabled'}.`)
				return resolve()
			}

			if (args[0] === 'enable' && !config.loggerChannels.has('default')) {
				message.channel.send(`No channel set for logging\nPlease set a channel with \`${config.commandPrefix}setlog\``)
				return resolve()
			}

			config.enableLogger = (args[0] === 'enable')
			client.saveConfig(message.guild.id)

			return resolve()
		})
	}
} as Command