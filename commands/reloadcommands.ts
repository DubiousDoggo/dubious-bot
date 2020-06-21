import { Collection } from "discord.js"
import { Command, PermissionLevel } from ".."

export default <Command>{
    name: 'reloadcommands',
    alias: ['recmd'],
    level: PermissionLevel.developer,
    description: 'reloads all commands and aliases',
    syntax: '',
    execute: async (message, _args, _config, client) => {
        client.aliasMap = new Collection<string, string>()
        client.commands = new Collection<string, Command>()
        client.loadCommands()
        message.channel.send("reloaded commands")
    }
}
