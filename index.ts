import Discord, { Collection, Guild, GuildMember, GuildResolvable, Message, Role, Snowflake, TextChannel } from 'discord.js';
import fs from 'fs';
import winston from 'winston';
import { guildBanAddHandler } from './eventHandlers/guildBanAddHandler';
import { guildBanRemoveHandler } from './eventHandlers/guildBanRemoveHandler';
import { guildMemberAddHandler } from './eventHandlers/guildMemberAddHandler';
import { guildMemberRemoveHandler } from './eventHandlers/guildMemberRemoveHandler';
import { messageDeleteHandler } from './eventHandlers/messageDeleteHandler';
import { messageHandler } from './eventHandlers/messageHandler';
import { messageUpdateHandler } from './eventHandlers/messageUpdateHandler';
import { roleCreateHandler } from './eventHandlers/roleCreateHandler';
import { roleDeleteHandler } from './eventHandlers/roleDeleteHandler';
import { roleUpdateHandler } from './eventHandlers/roleUpdateHandler';

export enum LoggerChannel { default, banAdd, banRemove, userJoin, userLeave, messageDelete, messageUpdate }
export enum PermissionLevel { user, admin, developer }
export type PermissionLevelResolvable = PermissionLevel | GuildMember

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
    loggerChannels: Collection<LoggerChannel, TextChannel>
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
export const commandDir = './commands'
export const configsDir = './configs'

export class DubiousBot extends Discord.Client {
    auth = JSON.parse(fs.readFileSync('./auth.json', fileEncoding))

    public aliasMap = new Collection<string, string>()
    public commands = new Collection<string, Command>()

    private configs = new Collection<Snowflake, ConfigFile>()

    constructor() {
        super()
        this.loadCommands()

        this.on('ready', () => logger.info('Connected').info(`Logged in as: ${this.user.tag}`).debug(`id: ${this.user.id}`))
        this.on('reconnecting', () => logger.warn('Connection interruped, reconnecting...'))
        this.on('disconnect', event => (event.wasClean ? logger.info : logger.warn)(`Disconnected ${event.reason}`).debug(`code: ${event.code}`))

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

        this.on('error', info => logger.error(info))
        this.on('warn', info => logger.warn(info))
        this.on('debug', info => logger.debug(info))
    }

    /**
     * Fetches the TextChannel within the guild for logging the given type of data.
     */
    public async fetchLogChannel(guild: Guild, type: LoggerChannel = LoggerChannel.default): Promise<TextChannel> {

        const config = this.fetchConfig(guild)
        const channel = config.loggerChannels.get(type) ?? config.loggerChannels.get(LoggerChannel.default)

        if (channel === undefined)
            throw Error('Log channel does not exist')

        return channel
    }

    /**
     * Fetches the command with the given name or alias.
     */
    public async fetchCommand(commandName: string): Promise<Command | undefined> {
        return this.commands.get(this.aliasMap.get(commandName) ?? commandName)
    }

    /**
     * Fetches the config file associated with the given guild.
     * If the file has not been cached, it is loaded and returned.
     */
    public fetchConfig(guild: Guild): ConfigFile {
        return this.configs.get(guild.id) ?? this.loadConfig(guild)
    }

    /**
     * Reads and returns the config file associated with the given guild.
     * The loaded config file is cached and can be retrieved with fetchConfig.
     * It is recomended to use fetchConfig instead of loadConfig, unless the
     * uncached config is required.
     */
    public loadConfig(guild: Guild): ConfigFile {
        const data = fs.readFileSync(fs.existsSync(`${configsDir}/${guild.id}.json`) ? `${configsDir}/${guild.id}.json` : `${configsDir}/default.json`, fileEncoding)
        const configData = JSON.parse(data) // TODO use the reviver instead of the mess below
        const config = configData as ConfigFile

        config.loggerChannels = new Collection<LoggerChannel, TextChannel>(configData.loggerChannels instanceof Array ?
            (configData.loggerChannels as Array<[string, string]>).filter(value => guild.channels.has(value[1]))
                .map<[LoggerChannel, TextChannel]>(value => [LoggerChannel[value[0] as keyof typeof LoggerChannel], guild.channels.get(value[1]) as TextChannel]) : undefined)

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
        const id: Snowflake = guild instanceof Guild ? guild.id : guild
        logger.debug(`saving config for guild id ${id}`)
        let data = JSON.stringify(
            this.configs.get(id),
            (_key, value) => {
                if (value instanceof Collection)
                    return value.map<[string, string]>((v, k) => [k, v.id])
                if (value instanceof Set)
                    return [...value]
                return value
            },
            '\t'
        )
        fs.writeFileSync(`${configsDir}/${id}.json`, data)
    }

    /**
     * Loads all commands from the command directory.
     * The commands must be defined in their own file, as a default export. All 
     * commands must implement the Command interface. By convention, the name of
     * the file should match the name of the command, however this is not 
     * explicily required.
     */
    public loadCommands() {
        logger.info('Loading Commands')
        fs.readdirSync(`${__dirname}/${commandDir}`, fileEncoding)
            .filter(fileName => fileName.endsWith('.js'))
            .forEach(fileName => {
                const fullName = `${__dirname}/${commandDir}/${fileName}`
                delete require.cache[require.resolve(fullName)] // force reload the file from disk, needed for reloadcommands
                const command = require(fullName).default as Command
                if (command === undefined)
                    throw Error(`file ${fileName} has no default export`)
                if (this.commands.has(command.name))
                    throw Error(`Command name collision ${fullName}`)
                this.commands.set(command.name, command)
                command.alias.forEach(alias => {
                    if (this.aliasMap.has(alias))
                        throw Error(`alias collision ${alias} for commands ${command.name}`)
                    this.aliasMap.set(alias, command.name)
                })
            })
    }
}

const bot = new DubiousBot()
bot.login(bot.auth.token)
