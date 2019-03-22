/*
 * TODO LIST
 * Add message logger
 * Fix documentation
 * Set up dependencies
 * Make output fancy
 */
import winston from 'winston'
import fs from 'fs'
import Discord, { Collection, Snowflake, Message, Role, Guild } from 'discord.js'
import messageHandler from './eventHandlers/messageHandler'
import roleDeleteHandler from './eventHandlers/roleDeleteHandler'
import messageUpdateHandler from './eventHandlers/messageUpdateHandler';
import messageDeleteHandler from './eventHandlers/messageDeleteHandler';

export type permissionLevel = 'user' | 'admin' | 'dev'

export interface Command {
	name: string
	alias: string[]
	level: permissionLevel
	desc: string
	usage: string
	execute: (message:Message, args:string[], config:ConfigFile, client:DubiousBot) => Promise<any>
}
export interface ConfigFile {
	commandPrefix: string
	enableLogger: boolean
	loggerChannelID: Snowflake
	assignableRoles: Collection<Snowflake, Role>
	adminRoles: Collection<Snowflake, Role>

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
	
	configs  = new Collection<Snowflake, ConfigFile>()
	aliasMap = new Collection<string, string>()
	commands = new Collection<string, Command>()
	constructor(){
		super()
		this.initCommands()

		this.on('ready', () => {
			logger.info('Connected')
			      .info(`Logged in as: ${this.user.tag}`)
			      .debug(`id: ${this.user.id}`)

			logger.info('Loading configs')
			this.guilds.forEach(guild => this.loadConfig(guild))
		})
		this.on('reconnecting', () => logger.warn('Connection interruped, reconnecting...'))
		this.on('disconnect', event => (event.wasClean ? logger.info : logger.warn)(`Disconnected ${event.reason}`).debug(`code: ${event.code}`))

		this.on('guildCreate', guild => this.loadConfig(guild))
		this.on('roleDelete', role => roleDeleteHandler(role, this))

		this.on('message', message => messageHandler(message, this).catch(error => logger.error(error.stack)))
		this.on('messageUpdate', (oldmessage, newmessage) => messageUpdateHandler(oldmessage, newmessage, this).catch(error => logger.error(error.stack)))
		this.on('messageDelete', message => messageDeleteHandler(message, this).catch(error => logger.error(error.stack)))

		this.on('error', error => logger.error(`${error.stack}`))
		this.on('warn', info => logger.warn(info))
		this.on('debug', info => (/heartbeat/ig.test(info) ? logger.silly : logger.debug)(info))
	}

	private initCommands = () => {
		fs.readdirSync('./commands', fileEncoding)
		  .filter( fileName => !fileName.startsWith('_') && fileName.endsWith('.js') )
		  .forEach(fileName => {
			const command = require(`./commands/${fileName}`).default as Command
			if(this.commands.has(command.name))
				throw Error(`Command name collision ${command.name}`)
			this.commands.set(command.name, command)
			command.alias.forEach(alias => {
				if(this.aliasMap.has(alias))
					throw Error(`alias collision ${alias} for commands ${command.name} and ${(this.commands.get(this.aliasMap.get(alias) as string) as Command).name}`)
				this.aliasMap.set(alias, command.name)
			})
		})
	}

	private loadConfig = (guild: Guild) => {
		fs.readFile(`./configs/${guild.id}.json`, fileEncoding, (err: NodeJS.ErrnoException, data: string) => {
			if (err) {
				if (err.code == 'ENOENT') {
					logger.debug(`No config file exists for guild id ${guild.id}, loading default config`)
					data = fs.readFileSync('./configs/default.json', fileEncoding)
				} else {
					throw err
				}
			}
			
			let	configData = JSON.parse(data)
			let config = configData as ConfigFile
			
			if(configData.adminRoles instanceof Array)
				config.adminRoles = new Collection<Snowflake, Role>((configData.adminRoles as Array<Snowflake>)
					.filter(id => guild.roles.has(id))
					.map<[Snowflake, Role]>(id => [id, guild.roles.get(id) as Role]))
			else 
				config.adminRoles = new Collection<Snowflake, Role>()
			
			if(configData.assignableRoles instanceof Array)
				config.assignableRoles = new Collection<Snowflake, Role>(
					(configData.assignableRoles as Array<Snowflake>)
					.filter(id => guild.roles.has(id))
					.map<[Snowflake, Role]>(id => [id, guild.roles.get(id) as Role])
				)
			else
				config.assignableRoles = new Collection<Snowflake, Role>()
			
			this.configs.set(guild.id, config)
			
			this.saveConfig(guild.id)
			logger.debug(`loaded config for guild id ${guild.id}`)
		})
	}

	saveConfig = (id: Snowflake) => {
		logger.debug(`saving config for guild id ${id}`)
		let data = JSON.stringify(this.configs.get(id),(_key, value) => value instanceof Collection ? value.keyArray() : value, 2)
		fs.writeFileSync(`./configs/${id}.json`, data)
	}
}

const bot = new DubiousBot()

bot.login(bot.auth.token)
