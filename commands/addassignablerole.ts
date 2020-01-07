import { Command, logger, PermissionLevel } from ".."

export const addAssignableRole: Command = {
	name: 'addassignablerole',
	alias: ['aasr'],
	level: PermissionLevel.admin,
	desc: 'Adds a role to the list of assignable roles.\nUsers will be able to self-assign and remove the listed roles using the giverole and removerole commands.',
	usage: '<...@role>',
	execute: async (message, _args, serverConfig, client) => {
		if (message.mentions.roles.size < 1)
			throw Error('No roles mentioned')

		let reply: string = ''
		message.mentions.roles.forEach(((role, id) => {
			if (serverConfig.adminRoles.has(id)) {
				reply += (`<@&${id}> is an admin role and cannot be made assignable\n`)
			} else if (serverConfig.assignableRoles.has(id)) {
				reply += (`<@&${id}> is already an assignable role\n`)
			} else {
				serverConfig.assignableRoles.set(id, role)
				reply += (`Added <@&${id}> as assignable role\n`)
				logger.debug(`Added @${role.name} as assignable role in server '${role.guild.name}'`)
			}
		}))
		message.channel.send(reply.trimRight())
		client.saveConfig(message.guild.id)
	}
}
