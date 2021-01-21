import { Guild, MessageEmbed, User } from "discord.js"
import { DubiousBot, LoggerChannel } from ".."

export const guildBanAddHandler = async (guild: Guild, user: User, client: DubiousBot): Promise<void> => {

    const config = client.fetchConfig(guild)
    if (!config.enableLogger)
        return

    const logChannel = await client.fetchLogChannel(guild, LoggerChannel.banAdd)

    const embed = new MessageEmbed()
        .setAuthor(user.tag, user.avatarURL() ?? undefined)
        .setTitle('User was banned')
        .setFooter(client.user?.username, client.user?.avatarURL() ?? undefined)
        .setTimestamp(new Date())
        .setColor('DARK_RED')
        .setDescription(
            `\u25baName : ${user.tag}\n` +
            `\u25baID : ${user.id}`)

    logChannel.send(`${user.tag} was banned`, embed)
}
