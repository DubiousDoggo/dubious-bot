import { Command, PermissionLevel } from ".."
import { RichEmbed } from "discord.js"
import { fetchLevel } from "../src/utils"

export const help: Command = {
	name: 'help',
	alias: [],
	level: PermissionLevel.user,
	desc: 'help! help! somebody! please!',
	usage: '[<command>]',
	execute: async (message, args, config, client) => {

		if (args.length > 1)
			throw Error(`Invalid argument '${args[1]}'`)

		if (args.length === 0) {
			const embed = new RichEmbed()
				.setTitle('Here is the list of available commands')
				.setThumbnail(message.guild.iconURL)
				.setColor('LUMINOUS_VIVID_PINK')

			client.commands
				.filter(command => !config.disabledCommands.has(command.name) && command.level <= fetchLevel(message.member, client))
				.forEach(command => embed.addField([command.name, ...command.alias].join(', '), command.desc))

			message.channel.send(embed)
			return
		}

		const command = await client.fetchCommand(args[0])
		if (command === undefined) {
			message.channel.send(`Unknown command \`'${args[0]}'\`\nType \`${config.commandPrefix}help\` for a list of commands`)
			return
		}

		const embed = new RichEmbed()
			.setTitle([command.name, ...command.alias].join(', '))
			.setDescription(command.desc)
			.setColor('LUMINOUS_VIVID_PINK')
			.addField('Usage', `${config.commandPrefix}${command.name} ${command.usage}`)

		if (command.level !== PermissionLevel.user)
			embed.addField('Permissions', `This command is for ${command.level} use only`)

		message.channel.send(embed)

	}
}
