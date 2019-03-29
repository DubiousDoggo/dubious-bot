import { Command } from "..";
import { humanList, weightedRandom } from "../src/utils";

export default {
	name: 'giverole',
	alias: ['giveroles', 'give'],
	level: 'user',
	desc: 'Gives the user some roles.\nThe roles mentioned must be in the assignable roles list.',
	usage: '<...@role>',
	execute: async (message, _args, serverConfig) => {
		return new Promise<void>((resolve, reject) => {
			if (message.mentions.roles.size < 1)
				return reject('No roles mentioned')

			const newUser = message.member.roles.size === 0
			//waiting on type patch
			//const [assign, unassigned] = message.mentions.roles.partition((_role, id) => serverConfig.assignableRoles.has(id))
			const assign = message.mentions.roles.filter((_role, id) => serverConfig.assignableRoles.has(id))
			const unassigned = message.mentions.roles.filter((_role, id) => !serverConfig.assignableRoles.has(id))

			message.member.addRoles(assign, 'user requested')

			if (unassigned.size === 0) {
				message.channel.send(`All done!${newUser ? `\nWelcome ${[`to ${message.guild.name}!`, `to the server`][weightedRandom(1, 1)]}` : ``}`)
			} else {
				message.channel.send(`${humanList(unassigned.map(role => role.name), 'is not an assignable role', 'are not assignable roles')}\n` +
					`You can check the list of roles using \`${serverConfig.commandPrefix}lasr\``)
			}
			return resolve()
		})
	}
} as Command