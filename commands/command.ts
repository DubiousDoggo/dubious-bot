import { Command, logger } from "..";
import { RichEmbed } from "discord.js";

export default {
	name: 'command',
	alias: ['cmd'],
	level: 'admin',
	desc: 'Enables or disables commands',
	usage: '[<enable|disable> <...command-name>]',
	execute: async (message, args, serverConfig, client) => {
		return new Promise<void>((resolve, reject) => {
			if (args.length > 0) {
				if (args[0] !== 'enable' && args[0] !== 'disable')
					return reject(`Invalid argument '${args[0]}'`)
				if (args.length < 2)
					return reject('Missing required arguments')
			}

			if (args.length === 0) {
				if (serverConfig.disabledCommands.size === 0)
					message.channel.send('There are currently no disabled commands')
				else
					message.channel.send(new RichEmbed().setTitle('Disabled Commands')
						.setDescription([...serverConfig.disabledCommands.values()].join('\n')))
				return resolve()
			}

			const embed = new RichEmbed()
				.setAuthor(message.author.tag, message.author.avatarURL)
				.setTitle(`${args[0] === 'enable' ? 'Enabled' : 'Disabled'} Commands`)
				.setFooter(client.user.username, client.user.avatarURL)
				.setTimestamp(new Date())

			let cmds = args.slice(1).map(cmd => cmd.toLowerCase())

			embed.setDescription(cmds.map(cmd => {
				if (client.aliasMap.has(cmd))
					cmd = client.aliasMap.get(cmd)!
				if (!client.commands.has(cmd))
					return (`Unknown command '${cmd}'`)

				if (args[0] === 'enable') {
					if (serverConfig.disabledCommands.has(cmd)) {
						serverConfig.disabledCommands.delete(cmd)
						return `${cmd} enabled`
					}
					return `${cmd} already enabled`
				} else {
					if (cmd === 'command')
						return 'Are you trying to break me??'

					if (!serverConfig.disabledCommands.has(cmd)) {
						serverConfig.disabledCommands.add(cmd)
						return `${cmd} disabled`
					}
					return `${cmd} already disabled`
				}
			}).join('\n'))

			message.channel.send(embed)

			logger.verbose(`${args[0]}d ${args.slice(2).map(cmd => cmd.toLowerCase()).toString()} in server '${message.guild.name}'`)
			logger.debug(`id:${message.guild.id}`)
			client.saveConfig(message.guild.id)
			return resolve()
		})
	}
} as Command