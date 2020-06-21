import { Command, PermissionLevel } from ".."

export default <Command>{
    name: 'execute',
    alias: ['exec', 'eval'],
    level: PermissionLevel.developer,
    description: 'evaluates a javascript expression',
    syntax: '<expression>',
    execute: async (message, args, _serverConfig, _client) => {
        const expression = args.join(' ')
        message.channel.send(`${eval(expression)}`)
    }
}
