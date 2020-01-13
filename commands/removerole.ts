import { Command, PermissionLevel } from ".."
import { humanList } from "../src/utils"

export default <Command>{
	name: 'removerole',
	alias: ['removeroles', 'rem', 'remrole'],
	level: PermissionLevel.user,
	desc: 'Removes roles from the user.\nThe roles mentioned must be in the assignable roles list.',
	usage: '<...@assignable-role>',
	execute: async (message, _args, serverConfig) => {
		if (message.mentions.roles.size < 1)
			throw Error('No roles mentioned')

		let remove = message.mentions.roles.keyArray().filter(id => serverConfig.assignableRoles.has(id) && message.member.roles.has(id))
		message.member.removeRoles(remove)

		if (remove.length === message.mentions.roles.size) {
			message.channel.send('All done!')
		} else {
			let reply: string = ''
			const nonassignable = message.mentions.roles.filter((_role, id) => !serverConfig.assignableRoles.has(id))
			const hasnt = message.mentions.roles.filter((_role, id) => !message.member.roles.has(id) && !nonassignable.has(id))

			if (hasnt.size !== 0)
				reply += (`You do not have the role${humanList(hasnt.map(role => role.name), '', '', 'or', '', 's')}`)

			let list = nonassignable.map(role => role.name)
			if (nonassignable.size !== 0)
				reply += `\n${humanList(list, 'is not an assignable role', 'are not assignable roles')}\n` +
					`You can check the list of roles using ${serverConfig.commandPrefix}listAssignableRoles`

			message.channel.send(reply)
		}
	}
}
