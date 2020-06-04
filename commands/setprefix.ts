import { Command, PermissionLevel } from ".."
import { InvalidArgumentError, MissingArgumentError } from "../src/Errors"

export default <Command>{
    name: 'setprefix',
    alias: ['spf'],
    level: PermissionLevel.admin,
    description: 'Set the command prefix.',
    syntax: '<prefix>',
    execute: async (message, args, serverConfig, client) => {
        if (args.length < 1)
            throw new MissingArgumentError()
        if (args.length > 1)
            throw new InvalidArgumentError(args[1])

        serverConfig.commandPrefix = args[0]
        client.saveConfig(message.guild.id)
        message.channel.send(`Set command prefix to \`${args[0]}\``)
    }
}
