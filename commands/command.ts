import { Command, logger } from "..";

export default {
	name: 'command',
	alias: ['cmd'],
	level: 'admin',
	desc: 'Enables or disables commands',
	usage: '<enable/disable> <command-name>',
	execute: async (message, args, serverConfig, client) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length < 2)
				return reject('Missing required arguments')
			if (args[0] !== 'enable' && args[0] !== 'disable')
				return reject(`Invalid argument '${args[0]}'`)

			let cmd = args[1].toLowerCase()
			if (client.aliasMap.has(cmd))
				cmd = client.aliasMap.get(cmd)!
			if (!client.commands.has(cmd))
				return reject(`Unknown command '${cmd}'`)

			if (args[0] === 'enable') {
				if (serverConfig.disabledCommands.has(cmd))
					serverConfig.disabledCommands.delete(cmd)
				else
					return resolve()
			} else {
				if (cmd === 'command') {
					message.channel.send(`Are you trying to break me??`)
					return resolve()
				}
				if (!serverConfig.disabledCommands.has(cmd))
					serverConfig.disabledCommands.add(cmd)
				else
					return resolve()
			}

			logger.verbose(`${args[0]}d ${cmd} in server '${message.guild.name}'`)
			logger.debug(`id:${message.guild.id}`)
			client.saveConfig(message.guild.id)
			return resolve()
		})
	}
} as Command