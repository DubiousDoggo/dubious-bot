import { TextChannel } from "discord.js"
import { Command, LoggerChannel, PermissionLevel } from ".."
import { InvalidArgumentError, MissingArgumentError } from "../src/Errors"

export default <Command>{
    name: 'setlog',
    alias: [],
    level: PermissionLevel.developer,
    desc: `Sets the channel for logging information.\n The availble categories are ${Object.values(LoggerChannel).filter(value => (typeof value === 'string')).join(', ')}`,
    usage: '<category>',
    execute: async (message, args, config, client) => {
        if (args.length === 0)
            throw new MissingArgumentError()

        if (!(args[0] in LoggerChannel))
            throw new InvalidArgumentError(args[0])

        const logType: LoggerChannel = LoggerChannel[args[0] as keyof typeof LoggerChannel]
        config.loggerChannels.set(logType, message.channel as TextChannel)
        client.saveConfig(message.guild.id)
        message.channel.send(`set \`${args[0]}\` logging channel to <#${message.channel.id}>`)
    }
}
