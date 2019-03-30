import { TextChannel } from "discord.js";
import { Command, LogChannelType } from "..";

export default {
	name: 'setlog',
	alias: [],
	level: 'dev',
	desc: 'Sets the channel for logging information.',
	usage: '[<message|join|mod|default>]',
	execute: async (message, args, config, client) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length > 0) {
				if (args[0] !== 'message' && args[0] !== 'join' && args[0] !== 'mod' && args[0] !== 'default')
					return reject(`Invalid Argument ${args[0]}`)
			} else
				args[0] = 'default'

			config.loggerChannels.set(args[0] as LogChannelType, message.channel as TextChannel)

			client.saveConfig(message.guild.id)

			return resolve()
		})
	}
} as Command