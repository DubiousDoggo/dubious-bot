import { Collection } from "discord.js"
import { Command, PermissionLevel } from ".."

export default <Command>{
	name: 'reloadcommands',
	alias: ['rec'],
	level: PermissionLevel.developer,
	desc: 'Reloads all commands and aliases',
	usage: '',
	execute: async (_message, _args, _config, client) => {
		client.aliasMap = new Collection<string, string>()
		client.commands = new Collection<string, Command>()
		client.initCommands()
	}
}
