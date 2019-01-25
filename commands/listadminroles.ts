import { Command } from "..";

export default {
	name: 'listadminroles',
	alias: ['ladr'],
	level: 'admin',
	desc: 'TODO',
	usage: '',
	execute: async (message, _args, serverConfig) => {
		return new Promise<void>((resolve, reject) => {
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