import { Command, PermissionLevel } from ".."

export default <Command>{
    name: 'ping',
    alias: [],
    level: PermissionLevel.user,
    desc: 'Play a friendly game of Ping Pong',
    usage: '',
    execute: async (message, _args, _config, client) => {
        message.channel.send(`Pong! ${client.ping}ms`)
    }
}
