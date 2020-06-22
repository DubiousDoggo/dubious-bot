import { RichEmbed } from "discord.js"
import { Command, PermissionLevel } from ".."
import { InvalidArgumentError } from "../src/errors"
import { fetchLevel } from "../src/utils"

export default <Command>{
    name: 'help',
    alias: [],
    level: PermissionLevel.user,
    description: 'help! help! somebody! please!',
    syntax: '[<command>]',
    execute: async (message, args, config, client) => {

        if (args.length > 1)
            throw new InvalidArgumentError(args[1])

        if (args.length === 0) {
            const embed = new RichEmbed()
                .setTitle('Here is the list of available commands')
                .setThumbnail(message.guild.iconURL)
                .setColor('LUMINOUS_VIVID_PINK')

            client.commands
                .filter(command => !config.disabledCommands.has(command.name) && command.level <= fetchLevel(message.member, client))
                .forEach(command => embed.addField([command.name, ...command.alias].join(', '), command.description))

            message.channel.send(embed)
            return
        }

        const command = await client.fetchCommand(args[0])
        if (command === undefined) {
            message.channel.send(`Unknown command \`${args[0]}\`\nType \`${config.commandPrefix}help\` for a list of commands`)
            return
        }

        const embed = new RichEmbed()
            .setTitle([command.name, ...command.alias].join(', '))
            .setDescription(command.description)
            .setColor('LUMINOUS_VIVID_PINK')
            .addField('Usage', `${config.commandPrefix}${command.name} ${command.syntax}`)

        if (command.level !== PermissionLevel.user)
            embed.addField('Permissions', `This command is for ${PermissionLevel[command.level]} use only`)

        message.channel.send(embed)

    }
}
