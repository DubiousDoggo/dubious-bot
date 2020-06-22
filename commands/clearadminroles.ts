import { Command, PermissionLevel } from "..";
import { InvalidArgumentError } from "../src/errors";

export default <Command>{
    name: 'clearadminroles',
    alias: ['cadr'],
    level: PermissionLevel.admin,
    description: 'Clears the list of admin roles.\n*Warning: This command may revoke admin access from yourself.*',
    syntax: '',
    execute: async (message, args, serverConfig, client) => {
        if (args.length > 0)
            throw new InvalidArgumentError(args[0])

        serverConfig.adminRoles.deleteAll()
        message.channel.send('Cleared admin roles')
        client.saveConfig(message.guild.id)
    }
}
