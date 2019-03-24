import { Command } from "..";

export default {
	name: 'listadminroles',
	alias: ['ladr'],
	level: 'admin',
	desc: 'Displays the list of authorized admin roles.',
	usage: '',
	execute: async (message, args, serverConfig) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length > 0)
				return reject(`Invalid argument '${args[0]}'`)
			
			if (serverConfig.adminRoles.size > 0) {
				let reply = 'The current admin roles are'
					+ (serverConfig.adminRoles.map((_role, id) => `\n<@&${id}>`).join())
				message.channel.send(reply)
			} else {
				message.channel.send('There are no admin roles currently set')
			}
			return resolve()
		})
	}
} as Command