import { permissionLevel, ConfigFile, DubiousBot } from "..";
import { GuildMember } from "discord.js";

export const humanList = (list: string[], singular = '', plural = '', conjunc = 'and', singularprefix = '', pluralprefix = ''): string => {
	if (list.length === 0)
		return 'NONE'
	if (list.length === 1)
		return `${singularprefix} ${list[0]} ${singular}`
	else
		return `${pluralprefix} ${list.slice(0, list.length - 1).join(', ')} ${conjunc} ${list[list.length - 1]} ${plural}`
}

export const weightedRandom = (...weights: number[]): number => {
	let total = weights.reduce((t, i) => t + i)
	let r = Math.floor(Math.random() * total)
	for (let i = 0; i < weights.length; i++) {
		if (r < weights[i])
			return i
		r -= weights[i]
	}
	throw new Error('weighted random failure')
}

export const getLevel = (member: GuildMember, client: DubiousBot): permissionLevel => {
	if (member.id === client.auth.developerID)
		return 'dev'

	if (client.fetchConfig(member.guild).adminRoles.keyArray().some(id => member.roles.has(id)))
		return 'admin'

	return 'user'
}

export const levelcmp = (lhs: GuildMember | permissionLevel, rhs: GuildMember | permissionLevel, client: DubiousBot): number => {
	return getComputedLevel(lhs, client) - getComputedLevel(rhs, client);
}

const getComputedLevel = (level: permissionLevel | GuildMember, client: DubiousBot): number => {
	if (level instanceof GuildMember)
		level = getLevel(level, client)

	switch (level) {
		case 'user': return 0
		case 'admin': return 2
		case 'dev': return 3
	}
}
