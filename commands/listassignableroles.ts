import { Command, PermissionLevel } from "..";

export const listAssignableRoles: Command = {
	name: 'listassignableroles',
	alias: ['lasr'],
	level: PermissionLevel.user,
	desc: 'Lists the roles that a user can assign to themselves',
	usage: '',
	execute: async (message, args, serverConfig) => {
		if (args.length > 0)
			throw Error(`Invalid argument '${args[0]}'`)

		if (serverConfig.assignableRoles.size > 0)
			message.channel.send('The current assignable roles are\n' +
				serverConfig.assignableRoles.map(role => role.name).join('\n'))
		else
			message.channel.send('There are no assignable roles currently available')
	}
}
