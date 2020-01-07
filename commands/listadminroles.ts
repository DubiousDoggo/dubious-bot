import { Command, PermissionLevel } from ".."

export const listAdminRoles: Command = {
	name: 'listadminroles',
	alias: ['ladr'],
	level: PermissionLevel.admin,
	desc: 'Displays the list of authorized admin roles.',
	usage: '',
	execute: async (message, args, serverConfig) => {
		if (args.length > 0)
			throw Error(`Invalid argument '${args[0]}'`)

		if (serverConfig.adminRoles.size > 0)
			message.channel.send('The current admin roles are\n' +
				serverConfig.adminRoles.map(role => role.name).join('\n'))
		else
			message.channel.send('There are no admin roles currently set')
	}
}
