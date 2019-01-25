import { Command, logger } from "..";

export default {
	name: 'removeassignablerole',
	alias: ['rasr'],
	level: 'admin',
	desc: 'TODO',
	usage: '@role [...@role]',
	execute: async (message, _args, serverConfig, client) => {
		if (message.mentions.roles.size <= 0)
			return Promise.reject('No roles specified')

		let reply = ''
		message.mentions.roles.forEach(((role, id) => {
			if(serverConfig.assignableRoles.delete(id)) {
				reply += `Removed <@&${id}> from assignable roles`
				logger.verbose(`Removed @${role.name} as assignable role in server '${role.guild.name}'`)
				logger.debug(`id:${id} id:${role.guild.id}`)
			} else {
				reply += `<@&${id}> is not an assignable role`
			}
		}))
		message.channel.send(reply.trimRight())
		client.saveConfig(message.guild.id)
		return Promise.resolve()
	}
} as Command