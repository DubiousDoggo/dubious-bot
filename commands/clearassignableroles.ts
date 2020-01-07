import { Command, logger, PermissionLevel } from ".."

export const clearAssignableRoles: Command = {
	name: 'clearassignableroles',
	alias: ['casr'],
	level: PermissionLevel.admin,
	desc: 'Clears the list of self-assignable roles.',
	usage: '',
	execute: async (message, args, serverConfig, client) => {
		if (args.length > 0)
			throw Error(`Invalid argument '${args[0]}'`)

		serverConfig.assignableRoles.deleteAll()
		message.channel.send('Cleared assignable roles')
		logger.verbose(`Cleared assignable roles in server '${message.guild.name}'`)
		logger.debug(`id:${message.guild.id}`)
		client.saveConfig(message.guild.id)
	}
}
