import { Command, PermissionLevel } from '..'
import { TextChannel, Role, User } from 'discord.js'

export default <Command>{
    name: 'reloadconfig',
    alias: ['reconf'],
    level: PermissionLevel.developer,
    description: 'reloads the config file for this guild.',
    syntax: '',
    execute: async (message, _args, serverConfig, client) => {
        serverConfig = client.loadConfig(message.guild)
        message.channel.send(`reloaded config \`\`\`${JSON.stringify(
            serverConfig,
            (_key, value) => {
                if (value instanceof Map || value instanceof Set) {
                    return [...value]
                }
                if (value instanceof TextChannel || value instanceof Role || value instanceof User) {
                    return value.id
                }
                return value
            },
            4
        )}\`\`\``)
    }
}
