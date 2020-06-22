import { TextChannel } from "discord.js"
import { Command, PermissionLevel } from ".."
import { InvalidArgumentError, MissingArgumentError } from "../src/errors"

export default <Command>{
    name: 'setuserlog',
    alias: [],
    level: PermissionLevel.developer,
    description: 'Sets the channel for logging specific users\' information.',
    syntax: '<@user>',
    execute: async (message, args, config, client) => {
        if (args.length === 0)
            throw new MissingArgumentError()
        if (args.length > 1)
            throw new InvalidArgumentError(args[2])

        const matches = args[0].match(/^<@!(\d+)>$/)
        if (!matches || matches.length !== 2)
            throw new InvalidArgumentError(args[0])

        config.userLogChannels.set(matches[1], message.channel as TextChannel)
        client.saveConfig(message.guild.id)
        message.channel.send(`set ${message.guild.member(matches[1])?.displayName}'s logging channel to <#${message.channel.id}>`)

    }
}
