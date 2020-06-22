import { Command, PermissionLevel } from ".."
import { InvalidArgumentError } from "../src/errors"

export default <Command>{
    name: 'listadminroles',
    alias: ['ladr'],
    level: PermissionLevel.admin,
    description: 'Displays the list of authorized admin roles.',
    syntax: '',
    execute: async (message, args, serverConfig) => {
        if (args.length > 0)
            throw new InvalidArgumentError(args[0])

        if (serverConfig.adminRoles.size > 0)
            message.channel.send('The current admin roles are\n' +
                serverConfig.adminRoles.map(role => role.name).join('\n'))
        else
            message.channel.send('There are no admin roles currently set')
    }
}
