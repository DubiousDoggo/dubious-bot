import { Command, logger } from "..";

export default {
	name: 'clearadminroles',
	alias: ['cadr'],
	level: 'admin',
	desc: 'TODO',
	usage: '',
	execute: async (message, args, serverConfig, client) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length > 0)
				return reject('Too many arguments')
		
			serverConfig.adminRoles.deleteAll()
			message.channel.send('Cleared admin roles')
			logger.verbose(`Cleared admin roles in server '${message.guild.name}'`)
			logger.debug(`id:${message.guild.id}`)
			client.saveConfig(message.guild.id)	
			return resolve()
		})		
	}
} as Command