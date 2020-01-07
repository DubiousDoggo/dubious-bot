import { Command, logger, PermissionLevel } from "..";

export const clearAdminRoles: Command = {
	name: 'clearadminroles',
	alias: ['cadr'],
	level: PermissionLevel.admin,
	desc: 'Clears the list of admin roles.\n*Warning: This command may revoke admin access from yourself.*',
	usage: '',
	execute: async (message, args, serverConfig, client) => {
		if (args.length > 0)
			throw Error(`Invalid argument '${args[0]}'`)

		serverConfig.adminRoles.deleteAll()
		message.channel.send('Cleared admin roles')
		logger.verbose(`Cleared admin roles in server '${message.guild.name}'`)
		logger.debug(`id:${message.guild.id}`)
		client.saveConfig(message.guild.id)
	}
}
