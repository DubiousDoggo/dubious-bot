import { Command, PermissionLevel } from ".."
import { MissingArgumentError } from "../src/Errors"

export default <Command>{
    name: 'removeadminrole',
    alias: ['radr'],
    level: PermissionLevel.admin,
    description: 'Revokes a role\'s access to admin commands.\n*Warning: this may revoke admin access from yourself!*',
    syntax: '<...@role>',
    execute: async (message, _args, serverConfig, client) => {
        if (message.mentions.roles.size <= 0)
            throw new MissingArgumentError('No roles were mentioned')

        message.mentions.roles.forEach((role, id) => {
            if (serverConfig.adminRoles.delete(id)) {
                message.channel.send(`Removed <@&${id}> from admin roles`)
            } else {
                message.channel.send(`<@&${id}> is not an admin role`)
            }
        })
        client.saveConfig(message.guild.id)
    }
}
