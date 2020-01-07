import { TextChannel } from "discord.js"
import { Command, LogChannelType, PermissionLevel } from ".."

export const setLog: Command = {
	name: 'setlog',
	alias: [],
	level: PermissionLevel.developer,
	desc: 'Sets the channel for logging information.',
	usage: '[<message|join|mod|default>]',
	execute: async (message, args, config, client) => {

		if (args.length > 0) {
			if (args[0] !== 'message' && args[0] !== 'join' && args[0] !== 'mod' && args[0] !== 'default')
				throw Error(`Invalid Argument ${args[0]}`)
		}

		config.loggerChannels.set(args[0] as LogChannelType, message.channel as TextChannel)
		client.saveConfig(message.guild.id)
	}
}
