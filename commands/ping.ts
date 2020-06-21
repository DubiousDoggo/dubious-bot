import { Command, PermissionLevel } from ".."

export default <Command>{
    name: 'ping',
    alias: [],
    level: PermissionLevel.user,
    description: 'Play a friendly game of Ping Pong',
    syntax: '',
    execute: async (message, _args, _config, client) => {
        message.channel.send(`Pong! ${client.ping.toFixed(1)}ms`)
    }
}
