import { Message, TextChannel, Util } from "discord.js";
import { DubiousBot } from "..";
import { levelcmp } from "../src/utils";

export default async (message: Message, client: DubiousBot) => {
	return new Promise<void>((resolve, _reject) => {
		if (message.author.bot)
			return resolve()

		if (!(message.channel instanceof TextChannel))
			return message.channel.send(`Hello, I'm ${client.user.username}\n` +
				`I'm not set up to hande DMs, but you can go bother <@${client.auth.developerID}> to fix stuff if you want`)

		const config = client.fetchConfig(message.guild)

		if (message.content.startsWith(config.commandPrefix)) {
			let args = message.content.substring(config.commandPrefix.length).split(' ')
			return client.fetchCommand(args.shift()).then(command => {

				if (config.disabledCommands.has(command.name))
					return message.channel.send(`${command.name} is disabled on this server`)

				if (levelcmp(command.level, message.member, client) > 0)
					return message.channel.send(`This command if for ${command.level} use only`)

				return command.execute(message, args, config, client)
					.catch(reason => message.channel.send(`${reason}\nUsage: ${command.name} ${command.usage}`))

			}).catch(cmd => message.channel.send(`Unknown command \`${Util.escapeMarkdown(cmd, false, true)}'\n` +
				`Type \`${config.commandPrefix}help\` for a list of commands`))

		} else if (message.isMentioned(client.user)) {
			return message.channel.send(`Hello, I'm ${client.user.username}\nPlease type \`${config.commandPrefix}help\` for a list of available commands`)
		}
	})
}