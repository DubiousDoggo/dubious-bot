import { Command, PermissionLevel } from ".."
import { MissingArgumentError } from "../src/errors"

export default <Command>{
    name: 'addadminrole',
    alias: ['aadr'],
    level: PermissionLevel.admin,
    description: 'Adds a role to the list of admin roles.\nThis only gives the role access to admin bot commands, not server access.',
    syntax: '<...@role>',
    execute: async (message, _args, serverConfig, client) => {
        if (message.mentions.roles.size < 1)
            throw new MissingArgumentError('No roles were mentioned')

        let reply: string = ''
        message.mentions.roles.forEach((role, id) => {
            if (serverConfig.assignableRoles.has(id)) {
                reply += (`<@&${id}> is an assignable role and cannot be made admin`)
            } else if (serverConfig.adminRoles.has(id)) {
                reply += (`<@&${id}> is already an admin role`)
            } else {
                serverConfig.adminRoles.set(id, role)
                reply += (`Added <@&${id}> as admin role`)
            }
        })
        message.channel.send(reply)
        client.saveConfig(message.guild.id)
    }
}
