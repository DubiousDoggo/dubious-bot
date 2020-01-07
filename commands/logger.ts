import { Command, PermissionLevel } from ".."

export const logger: Command = {
	name: 'logger',
	alias: ['log'],
	level: PermissionLevel.developer,
	desc: 'Enables or disables the logger.',
	usage: '[<enable|disable>]',
	execute: async (message, args, config, client) => {
		if (args.length === 0) {
			message.channel.send(`The logger is currently ${config.enableLogger ? 'enabled' : 'disabled'}.`)
			return
		}

		if (args[0] !== 'enable' && args[0] !== 'disable')
			throw Error(`Invalid argument ${args[0]}`)
		
		if (args.length > 1)
			throw Error(`Invalid argument ${args[1]}`)

		if (args[0] === 'enable' && !config.loggerChannels.has('default')) {
			message.channel.send(`No channel set for logging\nPlease set a channel with \`${config.commandPrefix}setlog\``)
			return
		}

		config.enableLogger = (args[0] === 'enable')
		client.saveConfig(message.guild.id)
	}
}
