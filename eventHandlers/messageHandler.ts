import { Message, TextChannel } from "discord.js";
import { DubiousBot } from "..";
import { levelcmp } from "../src/utils";

export default async (message: Message, client: DubiousBot) => {
	return new Promise<void>((resolve, _reject) => {
		if (message.author === client.user)
			return resolve()

		if (!(message.channel instanceof TextChannel)) {
			message.channel.send(`Hello, I'm ${client.user.username}\n` +
				`I'm not set up to hande DMs, but you can go bother <@${client.auth.developerID}> to fix stuff if you want`)
			return resolve()
		}

		const config = client.fetchConfig(message.guild)

		if (message.content.startsWith(config.commandPrefix)) {
			let args = message.content.substring(config.commandPrefix.length).split(' ')
			let cmd = args[0].toLowerCase()
			args = args.splice(1)

			if (client.aliasMap.has(cmd))
				cmd = client.aliasMap.get(cmd)!

			if (client.commands.has(cmd)) {
				if (config.disabledCommands.has(cmd)) 
					return message.channel.send(`${cmd} is disabled on this server`)

				const command = client.commands.get(cmd)!

				if (levelcmp(command.level, message.member, client) > 0)
					return message.channel.send(`This command if for ${command.level} use only`)
				
				return command.execute(message, args, config, client)
					.catch(reason => message.channel.send(`${reason}\nUsage: ${command.name} ${command.usage}`))

			} else {
				return message.channel.send(`Unknown command '${cmd}'\nType \`${config.commandPrefix}help\` for a list of commands`)
			}
		} else if (message.isMentioned(client.user)) {
			return message.channel.send(`Hello, I'm ${client.user.username}\nPlease type \`${config.commandPrefix}help\` for a list of available commands`)
		}
	})
}