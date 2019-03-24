import { Message, RichEmbed } from "discord.js";
import { DubiousBot, Command, ConfigFile } from "..";
import { timeString } from "../src/utils";

export default {

	name: 'status',
	alias: [],
	level: 'user',
	desc: 'Gives a list of things about the bot',
	usage: '',
	execute: async (message: Message, _args: string[], _serverConfig: ConfigFile, client: DubiousBot) => {
		const embed = new RichEmbed()
			.setTitle(`Bot Status`)	
			.setThumbnail(client.user.avatarURL)
			.setTimestamp(new Date())
			.setColor('BLUE')
			.addField(`The bot is in:`, `${client.guilds.size} servers`, true)
			.addField(`Ping:`, `${client.ping}ms`, true)
			.addField(`Uptime:`, `${timeString(client.uptime)}`, true)
		return message.channel.send(embed)
	}
} as Command