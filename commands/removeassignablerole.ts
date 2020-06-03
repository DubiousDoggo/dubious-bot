import { Command, PermissionLevel } from ".."

export default <Command>{
    name: 'removeassignablerole',
    alias: ['rasr'],
    level: PermissionLevel.admin,
    desc: 'Removes a role from being self-assignable.',
    usage: '<...@role>',
    execute: async (message, _args, serverConfig, client) => {
        if (message.mentions.roles.size < 1)
            throw Error('No roles mentioned')

        message.channel.send(message.mentions.roles.map((role, id) =>
            serverConfig.assignableRoles.delete(id)
                ? `Removed ${role.name} from assignable roles`
                : `${role.name} is not an assignable role`
        ).join('\n'))

        client.saveConfig(message.guild.id)
    }
} 
