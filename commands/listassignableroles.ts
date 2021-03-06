import { Command, PermissionLevel } from "..";
import { InvalidArgumentError } from "../src/errors";

export default <Command>{
    name: 'listassignableroles',
    alias: ['lasr'],
    level: PermissionLevel.user,
    description: 'Lists the roles that a user can assign to themselves',
    syntax: '',
    execute: async (message, args, serverConfig) => {
        if (args.length > 0)
            throw new InvalidArgumentError(args[0])

        if (serverConfig.assignableRoles.size > 0)
            message.channel.send('The current assignable roles are\n' +
                serverConfig.assignableRoles.map(role => role.name).join('\n'))
        else
            message.channel.send('There are no assignable roles currently available')
    }
}
