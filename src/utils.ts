import { GuildMember, TextChannel, Role } from "discord.js";
import { DubiousBot, PermissionLevel } from "..";

export const escapeTicks = (str: string) => `\`\u200b${str.replace(/(?<!`)`(?!`)/g, '``')}\u200b\``

export const humanList = (list: string[], singular = '', plural = '', conjunc = 'and', singularprefix = '', pluralprefix = ''): string => {
	if (list.length === 0) return 'NONE'
	if (list.length === 1) return `${singularprefix} ${list[0]} ${singular}`
	else return `${pluralprefix} ${list.slice(0, list.length - 1).join(', ')} ${conjunc} ${list[list.length - 1]} ${plural}`
}

/**
 * Fetches the PermissionLevel for the given member in the respective guild
 */
export const fetchLevel = (member: GuildMember, client: DubiousBot): PermissionLevel => {
	if (member.id === client.auth.developerID)
		return PermissionLevel.developer

	if (client.fetchConfig(member.guild).adminRoles.keyArray().some(member.roles.has))
		return PermissionLevel.admin

	return PermissionLevel.user
}
