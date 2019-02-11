import { Command } from "..";
import { RichEmbed } from "discord.js";
import { levelcmp } from "../src/utils";

export default {
	name: 'help',
	alias: [],
	level: 'user',
	desc: 'help! help! somebody! please!',
	usage: '[command]',

	execute: async (message, args, config, client) => {
		return new Promise<void>((resolve, reject) => {
			if(args.length > 1)
				return reject('Too many arguments')
			
			if(args.length === 0) {
				let embed = new RichEmbed()
					.setTitle('**Here is the list of available commands**')
					//.setAuthor(client.user.username, client.user.avatarURL)
					.setThumbnail(message.guild.iconURL)
					.setColor('RANDOM')
					//.setFooter('psst, go yell at Dubious to finish his documentation')
				client.commands.filter(command => levelcmp(command.level, message.member, client) <= 0)
				               .forEach(command => embed.addField(`**${command.name.concat(command.alias.length?`, ${command.alias.join(', ')}`:``)}**`, command.desc))
				message.channel.send(embed)
				return resolve()
			}
			
			if(client.aliasMap.has(args[0]))
				args[0] = client.aliasMap.get(args[0]) as string
				
			if(client.commands.has(args[0])) {
				let command = (client.commands.get(args[0]) as Command)	

				let reply = command.name
				if(command.alias.length > 0)
					reply += (`, ${command.alias.join(', ')}`)
				
				reply += `\n${command.desc}`
				
				if(command.level != 'user')
					reply += (`\nThis command is for ${command.level} use only`)
			
				reply += (`\nUsage: ${command.name} ${command.usage}`)
				
				reply = reply.replace(/TODO/m, `TODO <@${client.auth.developerID}> finish your documentation you lazy shit`).replace(/TODO(?<!\/\/)/gm, '//TODO')
					
				message.channel.send(reply)
				
			} else {
				message.channel.send(`Unknown command '${args[0]}'\nType ${config.commandPrefix}help for a list of comands`)
			}
			return resolve()
		})
	}
} as Command

