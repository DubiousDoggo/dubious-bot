import { Command } from "..";

export default {
	name: 'echo',
	alias: ['say'],
	level: 'user',
	desc: 'Repeats a string back to the user.',
	usage: '<...message>',
	execute: async (message, args) => {
		return new Promise<void>((resolve, reject) => {
			if(args.length < 1)
				return reject('Missing required arguments')
			message.channel.send(args.join(' '))
			return resolve()
		})
	}
} as Command