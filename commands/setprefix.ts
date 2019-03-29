import { Command, logger } from "..";

export default {
	name: 'setprefix',
	alias: ['spf'],
	level: 'admin',
	desc: 'Set the command prefix.',
	usage: '<prefix>',
	execute: async (message, args, serverConfig, client) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length < 1)
				return reject('Missing required arguments')
			if (args.length > 1)
				return reject(`Invalid argument ${args[1]}`)

			serverConfig.commandPrefix = args[0]
			client.saveConfig(message.guild.id)
			message.channel.send(`Set command prefix to '${args[0]}'`)
			logger.verbose(`Set command prefix in server ${message.guild.name} to ${args[0]}`)
			return resolve()
		})
	}
} as Command