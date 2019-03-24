import { Command } from "..";
import { Collection } from "discord.js";

export default {
	name: 'reloadcommands',
	alias: ['rec'],
	level: 'dev',
	desc: 'Reloads all commands and aliases',
	usage: '',
	execute: async (_message, _args, _config, client) => {
		client.aliasMap = new Collection<string, string>()
		client.commands = new Collection<string, Command>()
		client.initCommands()
	}
} as Command