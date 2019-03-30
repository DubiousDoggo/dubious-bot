import { Command } from "..";

export default {
	name: 'ping',
	alias: [],
	level: 'user',
	desc: 'Play a friendly game of Ping Pong',
	usage: '',
	execute: async (message, _args, _config, client) => {
		return new Promise<void>(_resolve => message.channel.send(`Pong! ${client.ping}ms`))
	}
} as Command