import { Command, logger } from "..";

export default {
	name: 'removeadminrole',
	alias: ['radr'],
	level: 'admin',
	desc: 'TODO',
	usage: '@role [...@role]',
	execute: async (message, _args, serverConfig, client) => {
		if (message.mentions.roles.size <= 0)
			return Promise.reject('No roles specified')

		message.mentions.roles.forEach(((role, id) => {
			if(serverConfig.adminRoles.delete(id)) {
				message.channel.send(`Removed <@&${id}> from admin roles`)
				logger.verbose(`Removed @${role.name} as admin role in server '${role.guild.name}'`)
				logger.debug(`id:${id} id:${role.guild.id}`)
			} else {
				message.channel.send(`<@&${id}> is not an admin role`)
			}
		}))
		client.saveConfig(message.guild.id)
		return Promise.resolve()
	}
} as Command