import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js"
import { DubiousBot, LoggerChannel } from ".."

export const guildMemberRemoveHandler = async (member: GuildMember | PartialGuildMember, client: DubiousBot): Promise<void> => {

    const config = client.fetchConfig(member.guild)
    if (!config.enableLogger)
        return

    const logChannel = await client.fetchLogChannel(member.guild, LoggerChannel.userLeave)

    const embed = new MessageEmbed()
        .setAuthor(member.user?.tag, member.user?.avatarURL() ?? undefined)
        .setTitle('User has left or been kicked')
        .setFooter(client.user?.username, client.user?.avatarURL() ?? undefined)
        .setTimestamp(new Date())
        .setColor('RED')
        .setDescription(
            `\u25baName: ${member.user?.tag}\n` +
            `\u25baJoined: ${member.joinedAt?.toUTCString()}\n` +
            `\u25baRoles: ${member.roles.cache.map(role => role.name).join(', ')}`)

    logChannel.send(`${member.user?.tag} has left`, embed)
}
