/*
 * TODO LIST
 * Fix documentation
 * Make output fancy
 * Figure out modules & definitions
 */
import Discord, { Collection, Guild, GuildResolvable, Message, Role, Snowflake, TextChannel, GuildMember } from 'discord.js';
import fs from 'fs';
import winston from 'winston';
import guildBanAddHandler from './eventHandlers/guildBanAddHandler';
import guildBanRemoveHandler from './eventHandlers/guildBanRemoveHandler';
import guildMemberAddHandler from './eventHandlers/guildMemberAddHandler';
import guildMemberRemoveHandler from './eventHandlers/guildMemberRemoveHandler';
import messageDeleteHandler from './eventHandlers/messageDeleteHandler';
import messageHandler from './eventHandlers/messageHandler';
import messageUpdateHandler from './eventHandlers/messageUpdateHandler';
import roleCreateHandler from './eventHandlers/roleCreateHandler';
import roleDeleteHandler from './eventHandlers/roleDeleteHandler';
import roleUpdateHandler from './eventHandlers/roleUpdateHandler';

export type PermissionLevel = 'user' | 'admin' | 'dev'
export type PermissionLevelResolvable = PermissionLevel | GuildMember
export type LogChannelType = 'mod' | 'join' | 'message' | 'default'

export interface Command {
	name: string
	alias: string[]
	level: PermissionLevel
	desc: string
	usage: string
	execute: (message: Message, args: string[], config: ConfigFile, client: DubiousBot) => Promise<void>
}

export interface ConfigFile {
	commandPrefix: string
	enableLogger: boolean
	loggerChannels: Collection<LogChannelType, TextChannel>
	assignableRoles: Collection<Snowflake, Role>
	adminRoles: Collection<Snowflake, Role>
	disabledCommands: Set<string>
}

export const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.padLevels(),
				winston.format.simple()
			)
		})
	]
})

export const fileEncoding = 'utf8'

export class DubiousBot extends Discord.Client {
	auth = JSON.parse(fs.readFileSync('./auth.json', fileEncoding))

	private configs = new Collection<Snowflake, ConfigFile>()

	aliasMap = new Collection<string, string>()
	commands = new Collection<string, Command>()

	constructor() {
		super()
		this.initCommands()

		this.on('ready', () => logger.info('Connected').info(`Logged in as: ${this.user.tag}`).debug(`id: ${this.user.id}`))
		this.on('reconnecting', () => logger.warn('Connection interruped, reconnecting...'))
		this.on('disconnect', event => (event.wasClean ? logger.info : logger.warn)(`Disconnected ${event.reason}`).debug(`code: ${event.code}`))

		/*
		this.on('guildCreate', guild => null)
		this.on('guildDelete', guild => null)
		*/

		this.on('guildBanAdd', (guild, user) => guildBanAddHandler(guild, user, this).catch(logger.error))
		this.on('guildBanRemove', (guild, user) => guildBanRemoveHandler(guild, user, this).catch(logger.error))

		/*
		this.on('channelCreate', channel => null)
		this.on('channelDelete', channel => null)
		this.on('channelUpdate', (oldChannel, newChannel) => null)
		*/

		this.on('roleCreate', role => roleCreateHandler(role, this).catch(logger.error))
		this.on('roleDelete', role => roleDeleteHandler(role, this).catch(logger.error))
		this.on('roleUpdate', (oldrole, newrole) => roleUpdateHandler(oldrole, newrole, this).catch(logger.error))

		this.on('guildMemberAdd', member => guildMemberAddHandler(member, this).catch(logger.error))
		this.on('guildMemberRemove', member => guildMemberRemoveHandler(member, this).catch(logger.error))

		this.on('message', message => messageHandler(message, this).catch(logger.error))
		this.on('messageDelete', message => messageDeleteHandler(message, this).catch(logger.error))
		this.on('messageDeleteBulk', messages => messages.forEach(message => messageDeleteHandler(message, this).catch(logger.error)))
		this.on('messageUpdate', (oldmessage, newmessage) => messageUpdateHandler(oldmessage, newmessage, this).catch(logger.error))

		this.on('error', error => logger.error(error))
		this.on('warn', info => logger.warn(info))
		this.on('debug', info => (/heartbeat/ig.test(info) ? logger.silly : logger.debug)(info))
	}

	/**
	 * 
	 * @param guild
	 * @param type 
	 */
	public async fetchLogChannel(guild: Guild, type?: LogChannelType): Promise<TextChannel> {
		return new Promise<TextChannel>((resolve, reject) => {
			if (type === undefined)
				type = 'default'
			const config = this.fetchConfig(guild)
			const channel = config.loggerChannels.get(type)
			if (channel === undefined) {
				if (type === 'default')
					return reject(type)
				return this.fetchLogChannel(guild).catch(_type => reject(type))
			}
			return resolve(channel)
		})
	}

	
	public async fetchCommand(cmd?: string): Promise<Command> {
		return new Promise<Command>((resolve, reject) => {
			if (cmd === undefined)
				return reject(cmd)
			if (this.aliasMap.has(cmd))
				cmd = this.aliasMap.get(cmd)!
			const command = this.commands.get(cmd)
			if (command === undefined)
				return reject(cmd)
			return resolve(command)
		})
	}

	/**
	 * Fetches the config file associated with the guild. If the file has not been cached, it is loaded and returned. 
	 * @param guild 
	 * @returns The `ConfigFile` object associated with the `guild`
	 */
	public fetchConfig(guild: Guild): ConfigFile {
		return this.configs.has(guild.id) ? this.configs.get(guild.id)! : this.loadConfig(guild)
	}

	public initCommands() {
		logger.info('Loading Commands')
		fs.readdirSync('./commands', fileEncoding)
			.filter(fileName => fileName.endsWith('.js') && !fileName.startsWith('_'))
			.forEach(fileName => {
				const command = require(`./commands/${fileName}`).default as Command
				if (this.commands.has(command.name))
					throw Error(`Command name collision ${command.name}`)
				this.commands.set(command.name, command)
				command.alias.forEach(alias => {
					if (this.aliasMap.has(alias))
						throw Error(`alias collision ${alias} for commands ${command.name} and `
							+ (this.commands.get(this.aliasMap.get(alias) as string) as Command).name)
					this.aliasMap.set(alias, command.name)
				})
			})
	}

	private loadConfig(guild: Guild): ConfigFile {
		const data = fs.readFileSync(fs.existsSync(`./configs/${guild.id}.json`) ? `./configs/${guild.id}.json` : './configs/default.json', fileEncoding)
		const configData = JSON.parse(data)
		const config = configData as ConfigFile

		config.loggerChannels = new Collection<LogChannelType, TextChannel>(configData.loggerChannels instanceof Array ?
			(configData.loggerChannels as Array<[string, string]>).filter(value => guild.channels.has(value[1]))
				.map<[LogChannelType, TextChannel]>(value => [value[0] as LogChannelType, guild.channels.get(value[1]) as TextChannel]) : undefined)

		config.adminRoles = new Collection<Snowflake, Role>(configData.adminRoles instanceof Array ?
			(configData.adminRoles as Array<[string, string]>).filter(value => guild.roles.has(value[1]))
				.map<[Snowflake, Role]>(value => [value[0], guild.roles.get(value[1]) as Role]) : undefined)

		config.assignableRoles = new Collection<Snowflake, Role>(configData.assignableRoles instanceof Array ?
			(configData.assignableRoles as Array<[string, string]>).filter(value => guild.roles.has(value[1]))
				.map<[Snowflake, Role]>(value => [value[0], guild.roles.get(value[1]) as Role]) : undefined)

		config.disabledCommands = new Set(configData.disabledCommands instanceof Array ? configData.disabledCommands : undefined)

		this.configs.set(guild.id, config)
		logger.debug(`loaded config for guild id ${guild.id}`)

		this.saveConfig(guild.id)
		return config
	}

	public saveConfig(guild: GuildResolvable) {
		const id = guild instanceof Guild ? guild.id : guild
		logger.debug(`saving config for guild id ${id}`)
		let data = JSON.stringify(this.configs.get(id), (_key, value) =>
			value instanceof Collection ? value.map<[string, string]>((v, k) => [k, v.id])
				: value instanceof Set ? [...value] : value, '\t')
		fs.writeFileSync(`./configs/${id}.json`, data)
	}
}

const bot = new DubiousBot()
bot.login(bot.auth.token)
