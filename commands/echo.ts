import { Command, PermissionLevel } from ".."

export const echo: Command = {
	name: 'echo',
	alias: ['say'],
	level: PermissionLevel.user,
	desc: 'Repeats a message back to the user.',
	usage: '<...message>',
	execute: async (message, args) => {
		if (args.length < 1)
			throw Error('Missing required arguments')
		message.channel.send(args.join(' '))
		message.delete()
	}
}
