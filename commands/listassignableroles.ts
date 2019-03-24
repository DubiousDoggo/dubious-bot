import { Command } from "..";

export default {
	name: 'listassignableroles',
	alias: ['lasr'],
	level: 'user',
	desc: 'Lists the roles that a user can assign to themselves',
	usage: '',
	execute: async (message, args, serverConfig) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length > 0)
				return reject(`Invalid argument '${args[0]}'`)

			if (serverConfig.assignableRoles.size > 0) {
				let reply = 'The current assignable roles are'
					+ (serverConfig.assignableRoles.map((_role, id) => `\n<@&${id}>`).join())
				message.channel.send(reply)
			} else {
				message.channel.send('There are no assignable roles currently set')
			}
			return resolve()
		})
	}
} as Command