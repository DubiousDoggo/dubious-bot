import { Command, logger } from "..";
import { promisify } from "util";


export default {
	name: 'shutdown',
	alias: ['quit'],
	level: 'dev',
	desc: 'TODO',
	usage: '[timeout]',
	execute: async (message, args, _, client) => {
		return new Promise<void>((resolve, reject) => {
			let timeout = 0
			if (args.length > 1)
				return reject('Too many arguments')
			if (args.length > 0) {
				if (!/^[0-9]+$/g.test(args[0])) 
					return reject('Argument must be numeric')
				
				timeout = Number(args[0])
				message.channel.send(`Shutting down in ${timeout} seconds`)
			}
			logger.info(`shutting down in ${timeout} seconds`);
			promisify(setTimeout)(timeout * 1000)
				.then(() => message.channel.send('Goodnight'))
				.then(() =>	client.destroy())
			
			return resolve()
		})
	}
} as Command