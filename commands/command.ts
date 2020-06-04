import { RichEmbed } from "discord.js"
import { Command, PermissionLevel } from ".."
import { InvalidArgumentError, MissingArgumentError } from "../src/Errors"

export default <Command>{
    name: 'command',
    alias: ['cmd'],
    level: PermissionLevel.admin,
    description: 'Enables or disables commands',
    syntax: '[<enable|disable> <...command-name>]',
    execute: async (message, args, serverConfig, client) => {

        if (args.length === 0) {
            if (serverConfig.disabledCommands.size === 0) {
                message.channel.send('There are currently no disabled commands')
            } else {
                const embed = new RichEmbed()
                    .setTitle('Disabled Commands')
                    .setDescription([...serverConfig.disabledCommands.values()].join('\n'))
                message.channel.send(embed)
            }
            return
        }

        if (args[0] !== 'enable' && args[0] !== 'disable')
            throw new InvalidArgumentError(args[0])

        if (args.length < 2)
            throw new MissingArgumentError()

        const embed = new RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setTitle(`${args[0] === 'enable' ? 'Enabled' : 'Disabled'} Commands`)
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp(new Date())

        let commandNames = args.slice(1).map(c => c.toLowerCase())

        embed.setDescription(commandNames.map(commandName => {
            if (client.aliasMap.has(commandName))
                commandName = client.aliasMap.get(commandName)!

            if (!client.commands.has(commandName))
                return (`Unknown command '${commandName}'`)

            if (args[0] === 'enable') {
                if (serverConfig.disabledCommands.has(commandName)) {
                    serverConfig.disabledCommands.delete(commandName)
                    return `${commandName} enabled`
                }
                return `${commandName} already enabled`
            } else {
                if (commandName === 'command')
                    return 'Are you trying to break me??'

                if (!serverConfig.disabledCommands.has(commandName)) {
                    serverConfig.disabledCommands.add(commandName)
                    return `${commandName} disabled`
                }
                return `${commandName} already disabled`
            }
        }).join('\n'))

        message.channel.send(embed)

        client.saveConfig(message.guild.id)
    }
}
