import { Message, TextChannel } from "discord.js";
import { DubiousBot, ConfigFile, Command } from "..";
import { getComputedLevel } from "../src/utils";

export default async (message: Message, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		if(message.author === client.user)
			return resolve()

		// TODO handle DMs
		if(!(message.channel instanceof TextChannel)) {
			message.channel.send(`Hello, I'm ${client.user.username}\nI'm not set up to hande DMs yet, but you can go bother <@${client.auth.developerID}> to fix stuff if you want`)
			console.debug(message)
			return resolve()
		}

		if (!client.configs.has(message.guild.id))
			reject(new Error(`No config file exists for guild id ${message.guild.id}`))
		
		let serverConfig = client.configs.get(message.guild.id) as ConfigFile

		if (message.content.startsWith(serverConfig.commandPrefix)) {

			let args = message.content.substring(serverConfig.commandPrefix.length).split(' ')
			let cmd = args[0].toLowerCase()
			args = args.splice(1)

			if(client.aliasMap.has(cmd)) 
				cmd = client.aliasMap.get(cmd) as string

			if(client.commands.has(cmd)) {
				let command = client.commands.get(cmd) as Command

				if (getComputedLevel(command.level,client) > getComputedLevel(message.member,client)) {
					message.channel.send(`This command if for ${command.level} use only`)
					return resolve()
				}
				command.execute(message, args, serverConfig, client)
				       .catch( reason => { message.channel.send(`${reason}\nUsage: ${command.name} ${command.usage}`) })

			} else {
				message.channel.send(`Unknown command '${cmd}'\nType \`${serverConfig.commandPrefix}help\` for a list of commands`)
				return resolve()
			}
		} else if(message.isMentioned(client.user)) {
			message.channel.send(`Hello, I'm ${client.user.username}\nPlease type \`${serverConfig.commandPrefix}help\` for a list of available commands`)
		}
	})
}