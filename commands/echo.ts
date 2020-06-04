import { Command, PermissionLevel } from ".."

export default <Command>{
    name: 'echo',
    alias: ['say'],
    level: PermissionLevel.user,
    description: 'Repeats a message back to the user.',
    syntax: '<...message>',
    execute: async (message, args) => {
        if (args.length < 1)
            throw Error('Missing required arguments')
        message.channel.send(args.join(' '))
        message.delete()
    }
}
