import { Command, PermissionLevel } from "..";
import { InvalidArgumentError } from "../src/Errors";

export default <Command>{
    name: 'clearadminroles',
    alias: ['cadr'],
    level: PermissionLevel.admin,
    desc: 'Clears the list of admin roles.\n*Warning: This command may revoke admin access from yourself.*',
    usage: '',
    execute: async (message, args, serverConfig, client) => {
        if (args.length > 0)
            throw new InvalidArgumentError(args[0])

        serverConfig.adminRoles.deleteAll()
        message.channel.send('Cleared admin roles')
        client.saveConfig(message.guild.id)
    }
}
