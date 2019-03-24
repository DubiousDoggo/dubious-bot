import { Command } from "..";
import { RichEmbed } from "discord.js";
import { levelcmp } from "../src/utils";

export default {
	name: 'help',
	alias: [],
	level: 'user',
	desc: 'help! help! somebody! please!',
	usage: '[<command>]',

	execute: async (message, args, config, client) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length > 1)
				return reject(`Invalid argument '${args[1]}'`)

			if (args.length === 0) {
				let embed = new RichEmbed()
					.setTitle('Here is the list of available commands')
					.setThumbnail(message.guild.iconURL)
					.setColor('LUMINOUS_VIVID_PINK')

				client.commands
					.filter(command => !config.disabledCommands.has(command.name) && levelcmp(command.level, message.member, client) <= 0)
					.forEach(command => embed.addField(`${[command.name, ...command.alias].join(', ')}`, command.desc))
				message.channel.send(embed)
				return resolve()
			}

			if (client.aliasMap.has(args[0]))
				args[0] = client.aliasMap.get(args[0]) as string

			if (client.commands.has(args[0])) {
				let command = (client.commands.get(args[0]) as Command)

				let reply = `${[command.name, ...command.alias].join(', ')}\n${command.desc}`

				if (command.level != 'user')
					reply += (`\nThis command is for ${command.level} use only`)

				reply += (`\nUsage: ${command.name} ${command.usage}`)

				message.channel.send(reply)

			} else {
				message.channel.send(`Unknown command '${args[0]}'\nType ${config.commandPrefix}help for a list of comands`)
			}
			return resolve()
		})
	}
} as Command

