import { Command, PermissionLevel } from ".."
import { InvalidArgumentError } from "../src/Errors"

export default <Command>{
    name: 'clearassignableroles',
    alias: ['casr'],
    level: PermissionLevel.admin,
    description: 'Clears the list of self-assignable roles.',
    syntax: '',
    execute: async (message, args, serverConfig, client) => {
        if (args.length > 0)
            throw new InvalidArgumentError(args[0])

        serverConfig.assignableRoles.deleteAll()
        message.channel.send('Cleared assignable roles')
        client.saveConfig(message.guild.id)
    }
}
