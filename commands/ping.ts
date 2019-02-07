import { Command } from "..";

export default {
	name: 'ping',
	alias: [],
	level: 'user',
	desc: 'Play a friendly game of Ping Pong',
	usage: '',
	execute: async (message, _args, _config, client) => {
		return message.channel.send(`Pong! ${client.ping}ms`)
	}
} as Command