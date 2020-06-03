import { Command, PermissionLevel } from ".."
import { MissingArgumentError } from "../src/Errors"
import { humanList } from "../src/utils"

export default <Command>{
    name: 'giverole',
    alias: ['giveroles', 'give'],
    level: PermissionLevel.user,
    desc: 'Gives the user some roles.\nThe roles mentioned must be in the assignable roles list.',
    usage: '<...@role>',
    execute: async (message, _args, serverConfig) => {

        if (message.mentions.roles.size < 1)
            throw new MissingArgumentError('No roles were mentioned')

        const [assign, unassigned] = message.mentions.roles.partition((_role, id) => serverConfig.assignableRoles.has(id))

        message.member.addRoles(assign, 'user requested')

        if (unassigned.size) {
            message.channel.send(`${humanList(unassigned.map(role => role.name), 'is not an assignable role', 'are not assignable roles')}\n` +
                `You can check the list of roles using \`${serverConfig.commandPrefix}listAssignableRoles\``)
        }
    }
}
