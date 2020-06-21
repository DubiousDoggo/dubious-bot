import { Message, TextChannel } from "discord.js"
import { DubiousBot } from ".."
import { InvalidArgumentError, MissingArgumentError } from "../src/Errors"
import { fetchLevel } from "../src/utils"

export const messageHandler = async (message: Message, client: DubiousBot): Promise<void> => {

    if (message.author.bot) {
        return
    }

    if (!(message.channel instanceof TextChannel)) {
        message.channel.send(`Hello, I'm ${client.user.username},\nI'm not set up to hande DMs, but you can bother <@!${client.auth.developerID}> if you have any issues!`)
        return
    }

    const config = client.fetchConfig(message.guild)

    if (message.content.startsWith(config.commandPrefix)) {

        const [commandName, ...args] = message.content.substring(config.commandPrefix.length).split(' ')

        const command = await client.fetchCommand(commandName)

        if (command === undefined) {
            message.channel.send(`Unknown command \`${commandName}\`\nTry \`help\` for a list of commands`)
            return
        }

        if (config.disabledCommands.has(command.name)) {
            message.channel.send(`\`${command.name}\` is disabled on this server`)
            return
        }

        if (command.level > fetchLevel(message.member, client)) {
            message.channel.send(`This command if for ${command.level} use only`)
            return
        }

        try {
            await command.execute(message, args, config, client)
        } catch (error) {
            if (error instanceof MissingArgumentError) {
                message.channel.send(`Missing required argument\nUsage: \`${command.name} ${command.syntax}\``)
            } else if (error instanceof InvalidArgumentError) {
                message.channel.send(`Invalid argument \`${error.message}\`\nUsage: \`${command.name} ${command.syntax}\``)
            } else {
                throw error
            }
        }

    } else if (message.isMentioned(client.user)) {
        message.channel.send(`Hello, I'm ${client.user.username}!\nType \`${config.commandPrefix}help\` for a list of available commands`)
    }

}
