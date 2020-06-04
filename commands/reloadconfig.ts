import { Command, PermissionLevel } from '..'

export default <Command>{
    name: 'reloadconfig',
    alias: ['reconf'],
    level: PermissionLevel.developer,
    description: 'reloads the config file for this guild.',
    syntax: '',
    execute: async (message, _args, serverConfig, client) => {
        serverConfig = client.loadConfig(message.guild)
        message.channel.send(`reloaded config \`\`\`${JSON.stringify(serverConfig, undefined, 2)}\`\`\``)
    }
}
