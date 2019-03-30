import { GuildMember } from "discord.js";
import { DubiousBot, PermissionLevel, PermissionLevelResolvable } from "..";

export const escapeTicks = (str: string) => `\`\u200b${str.replace(/(?<!`)`(?!`)/g,'``')}\u200b\``

export const humanList = (list: string[], singular = '', plural = '', conjunc = 'and', singularprefix = '', pluralprefix = ''): string => {
	if (list.length === 0)
		return 'NONE'
	if (list.length === 1)
		return `${singularprefix} ${list[0]} ${singular}`
	else
		return `${pluralprefix} ${list.slice(0, list.length - 1).join(', ')} ${conjunc} ${list[list.length - 1]} ${plural}`
}

export const weightedRandom = (...weights: number[]): number => {
	const total = weights.reduce((t, i) => t + i)
	let r = Math.floor(Math.random() * total)
	for (let i = 0; i < weights.length; i++) {
		if (r < weights[i])
			return i
		r -= weights[i]
	}
	throw new Error('weighted random failure')
}

export const levelcmp = (lhs: PermissionLevelResolvable, rhs: PermissionLevelResolvable, client: DubiousBot): number => {
	return getComputedLevel(lhs, client) - getComputedLevel(rhs, client);
}

const getComputedLevel = (level: PermissionLevelResolvable, client: DubiousBot): number => {
	if (level instanceof GuildMember)
		level = getLevel(level, client)

	switch (level) {
		case 'user': return 0
		case 'admin': return 2
		case 'dev': return 3
	}
}

const getLevel = (member: GuildMember, client: DubiousBot): PermissionLevel => {
	if (member.id === client.auth.developerID)
		return 'dev'

	if (client.fetchConfig(member.guild).adminRoles.keyArray().some(member.roles.has))
		return 'admin'

	return 'user'
}
