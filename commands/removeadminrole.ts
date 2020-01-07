import { Command, logger, PermissionLevel } from ".."

export const removeAdminRole: Command = {
	name: 'removeadminrole',
	alias: ['radr'],
	level: PermissionLevel.admin,
	desc: 'Revokes a role\'s access to admin commands.\n*Warning: this may revoke admin access from yourself!*',
	usage: '<...@role>',
	execute: async (message, _args, serverConfig, client) => {
		if (message.mentions.roles.size <= 0)
			throw Error('No roles specified')

		message.mentions.roles.forEach(((role, id) => {
			if (serverConfig.adminRoles.delete(id)) {
				message.channel.send(`Removed <@&${id}> from admin roles`)
				logger.verbose(`Removed @${role.name} as admin role in server '${role.guild.name}'`)
				logger.debug(`id:${id} id:${role.guild.id}`)
			} else {
				message.channel.send(`<@&${id}> is not an admin role`)
			}
		}))
		client.saveConfig(message.guild.id)
	}
}
