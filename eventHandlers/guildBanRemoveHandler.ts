import { Guild, MessageEmbed, User } from "discord.js"
import { DubiousBot, LoggerChannel } from ".."

export const guildBanRemoveHandler = async (guild: Guild, user: User, client: DubiousBot): Promise<void> => {

    const config = client.fetchConfig(guild)
    if (!config.enableLogger)
        return

    const logChannel = await client.fetchLogChannel(guild, LoggerChannel.banRemove)

    const embed = new MessageEmbed()
        .setAuthor(user.tag, user.avatarURL() ?? undefined)
        .setTitle('User was unbanned')
        .setFooter(client.user?.username, client.user?.avatarURL() ?? undefined)
        .setTimestamp(new Date())
        .setColor('DARK_GREEN')
        .setDescription(
            `\u25baName : ${user.tag}\n` +
            `\u25baID : ${user.id}`)

    logChannel.send(`${user.tag} was unbanned`, embed)
}
