import { Command, logger } from "..";

export default {
	name: 'removeassignablerole',
	alias: ['rasr'],
	level: 'admin',
	desc: 'Removes a role from being self-assignable.',
	usage: '<...@role>',
	execute: async (message, _args, serverConfig, client) => {
		return new Promise<void>((resolve, reject) => {
			if (message.mentions.roles.size < 1)
				return reject('No roles mentioned')

			message.channel.send(message.mentions.roles.map((role, id) =>
				serverConfig.assignableRoles.delete(id)
					? `Removed ${role.name} from assignable roles`
					: `${role.name} is not an assignable role`
			).join('\n'))

			client.saveConfig(message.guild.id)
			return resolve()
		})
	}
} as Command