import { Command } from "..";
import { humanList } from "../src/utils";

export default {
	name: 'removerole',
	alias: ['removeroles', 'rem'],
	level: 'user',
	desc: 'Removes roles from the user.\nThe roles mentioned must be in the assignable roles list.',
	usage: '@role [...@roles]',
	execute: async (message, _args, serverConfig) => {
		return new Promise<void>((resolve, reject) => {
			if(message.mentions.roles.size <= 0)
				return reject('No roles mentioned')
			
			let remove = message.mentions.roles.filter((_role, id) => serverConfig.assignableRoles.has(id) && message.member.roles.has(id))
			message.member.removeRoles(remove)
			
			if(remove.size === message.mentions.roles.size) {
				message.channel.send('All done!')
			} else {
				let reply:string = ''
				let nonassignable = message.mentions.roles.filter((_role, id) => !serverConfig.assignableRoles.has(id))
				let hasnt = message.mentions.roles.filter((_role, id) => !message.member.roles.has(id) && !nonassignable.has(id))
				
				if(hasnt.size !== 0)
					reply += (`You do not have the role${humanList(hasnt.map(role => role.name),'','','or','','s')}`)

				let list = nonassignable.map(role => role.name)
				if(nonassignable.size !== 0)
					reply += `\n${humanList(list,'is not an assignable role','are not assignable roles')}`
								+  `\nYou can check the list of roles using ${serverConfig.commandPrefix}lasr\n`
				
				message.channel.send(reply.trimRight())
			}
			return resolve();
		})
	}
} as Command