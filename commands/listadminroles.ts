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

			if (serverConfig.adminRoles.size > 0)
				message.channel.send('The current admin roles are\n' +
					serverConfig.adminRoles.map(role => role.name).join('\n'))
			else
				message.channel.send('There are no admin roles currently set')

			return resolve()
		})
	}
} as Command