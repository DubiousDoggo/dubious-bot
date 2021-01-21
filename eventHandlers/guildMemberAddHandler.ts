import { GuildMember, MessageEmbed } from "discord.js"
import { DubiousBot, LoggerChannel } from ".."

export const guildMemberAddHandler = async (member: GuildMember, client: DubiousBot): Promise<void> => {

    const config = client.fetchConfig(member.guild)
    if (!config.enableLogger)
        return

    const logChannel = await client.fetchLogChannel(member.guild, LoggerChannel.userJoin)

    const embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user?.avatarURL() ?? undefined)
        .setTitle('User has joined')
        .setFooter(client.user?.username, client.user?.avatarURL() ?? undefined)
        .setTimestamp(new Date())
        .setColor('AQUA')
        .setDescription(
            `\u25baName: ${member.user.tag}\n` +
            `\u25baJoined: ${member.joinedAt?.toUTCString()}`)

    logChannel.send(`${member.user.tag} has joined`, embed)
}
