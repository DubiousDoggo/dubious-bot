import { Command, logger } from "..";

export default {
	name: 'javascript',
	alias: ['js'],
	level: 'dev',
	desc: 'This is a really bad idea\nI don\'t know why this is even a command that exists',
	usage: 'expression',
	execute: async (message, args, _serverConfig, client) => {
		return new Promise<void>((resolve, reject) => {
			if (message.author.id === client.auth.developerID) {
				let expression = args.join(' ')
				logger.warn(`Unsafe Eval: ${expression}`)
				message.channel.send(`${eval(expression)}`)
				return resolve()
			} else {
				logger.warn('Unsafe Eval');
				return reject('This command is for developer use only')
			}
		})
	}
} as Command