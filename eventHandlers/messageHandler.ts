import { Message, TextChannel } from "discord.js";
import { DubiousBot, logger } from "..";
import { getComputedLevel } from "../src/utils";
//import sqlite3 from "sqlite3";

export default async (message: Message, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		if (message.author === client.user)
			return resolve()

		// TODO handle DMs
		if (!(message.channel instanceof TextChannel)) {
			message.channel.send(`Hello, I'm ${client.user.username}\nI'm not set up to hande DMs yet, but you can go bother <@${client.auth.developerID}> to fix stuff if you want`)
			console.debug(message)
			return resolve()
		}

		let serverConfig = client.configs.get(message.guild.id)

		if (serverConfig === undefined)
			return reject(new Error(`No config file exists for guild id ${message.guild.id}`))

		/*
		if (serverConfig.enableLogger) {
			let db = new sqlite3.Database(`./db/${message.guild.id}.db`, err => {
				if(err)
					logger.error(err.message)
			})

			db.prepare

			db.close()

		}
		*/

		if (message.content.startsWith(serverConfig.commandPrefix)) {

			let args = message.content.substring(serverConfig.commandPrefix.length).split(' ')
			let cmd = args[0].toLowerCase()
			args = args.splice(1)

			if (client.aliasMap.has(cmd))
				cmd = client.aliasMap.get(cmd)!

			if (client.commands.has(cmd)) {
				if (serverConfig.disabledCommands.has(cmd)) {
					message.channel.send(`${cmd} is disabled on this server`)
					return resolve()
				}

				let command = client.commands.get(cmd)!

				if (getComputedLevel(command.level, client) > getComputedLevel(message.member, client)) {
					message.channel.send(`This command if for ${command.level} use only`)
					return resolve()
				}
				command.execute(message, args, serverConfig, client)
					.catch(reason => { message.channel.send(`${reason}\nUsage: ${command.name} ${command.usage}`) })

			} else {
				message.channel.send(`Unknown command '${cmd}'\nType \`${serverConfig.commandPrefix}help\` for a list of commands`)
				return resolve()
			}
		} else if (message.isMentioned(client.user)) {
			message.channel.send(`Hello, I'm ${client.user.username}\nPlease type \`${serverConfig.commandPrefix}help\` for a list of available commands`)
		}
	})
}