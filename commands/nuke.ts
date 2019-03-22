import { Command, logger } from "..";

export default {
	name: 'nuke',
	alias: ['abort'],
	level: 'dev',
	desc: 'Gracefully shuts down the bot in case of emergency',
	usage: '',
	execute: async (message, _args, _serverConfig, client) => {
		return new Promise<void>((resolve, reject) => {
			message.channel.send('Shutting down... Goodnight')
			logger.info('shutting down');
			client.configs.forEach( (_value, config) => client.saveConfig(config) )
			client.destroy()
			return resolve()
		})
	}
} as Command