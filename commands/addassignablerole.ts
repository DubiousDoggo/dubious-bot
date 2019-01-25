import { Command, logger } from "..";


export default {
	name: 'addassignablerole',
	alias: ['aasr'],
	level: 'admin',
	desc: 'TODO',
	usage: '@role [...@role]',
	execute: async (message, _args, serverConfig, client) => {
		return new Promise<void>((resolve, reject) => {
			if (message.mentions.roles.size <= 0) 
				return reject('No roles mentioned')
			
			let reply: string = ''
			message.mentions.roles.forEach(((role, id) => {
				if(serverConfig.adminRoles.has(id)) {
					reply += (`<@&${id}> is an admin role and cannot be made assignable\n`)
				} else if(serverConfig.assignableRoles.has(id)) {
					reply += (`<@&${id}> is already an assignable role\n`)
				} else {
					serverConfig.assignableRoles.set(id, role)
					reply += (`Added <@&${id}> as assignable role\n`)
					logger.debug(`Added @${role.name} as assignable role in server '${role.guild.name}'`)		
				}
			}))
			message.channel.send(reply.trimRight())
			client.saveConfig(message.guild.id)
			return resolve()
		})
	}
} as Command