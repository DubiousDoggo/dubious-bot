import { TextChannel } from "discord.js"
import { Command, PermissionLevel } from ".."
import { InvalidArgumentError, MissingArgumentError } from "../src/errors"

export default <Command>{
    name: 'clearuserlog',
    alias: [],
    level: PermissionLevel.developer,
    description: 'Unsets the channel for logging specific users\' information.\nThe user\'s logs will still be tracked in the default logging channels.',
    syntax: '<@user>',
    execute: async (message, args, config, client) => {
        if (args.length === 0)
            throw new MissingArgumentError()
        if (args.length > 1)
            throw new InvalidArgumentError(args[2])

        const matches = args[0].match(/^<@!(\d+)>$/)
        if (!matches || matches.length !== 2)
            throw new InvalidArgumentError(args[0])

        if (!config.userLogChannels.has(matches[1])) {
            message.channel.send(`${message.guild.member(matches[1]).displayName} does not have a custom logging channel`)
        } else {
            config.userLogChannels.delete(matches[1])
            client.saveConfig(message.guild.id)
            message.channel.send(`cleared ${message.guild.member(matches[1]).displayName}'s logging channel`)
        }
    }
}
