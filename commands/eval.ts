import { Command, PermissionLevel } from ".."

export default <Command>{
    name: 'execute',
    alias: ['exec', 'eval'],
    level: PermissionLevel.developer,
    desc: 'evaluates a javascript expression',
    usage: '<expression>',
    execute: async (message, args, _serverConfig, _client) => {
        const expression = args.join(' ')
        message.channel.send(`${eval(expression)}`)
    }
}
