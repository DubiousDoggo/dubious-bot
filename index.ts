import Discord, { Collection, Guild, GuildMember, GuildResolvable, Message, Role, Snowflake, TextChannel, GuildChannel, User, SnowflakeUtil } from 'discord.js';
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
    description: string
    syntax: string
    execute: (message: Message, args: string[], config: Config, client: DubiousBot) => Promise<void>
}

export const configVersion = 1
export interface Config {
    readonly version: number
    commandPrefix: string
    enableLogger: boolean
    loggerChannels: Collection<LoggerChannel, TextChannel>
    userLogChannels: Collection<Snowflake, TextChannel>
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

    private configs = new Collection<Snowflake, Config>()

    constructor() {
        super({ partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'] })
        this.loadCommands()

        this.on('ready', () => logger.info('Connected').info(`Logged in as: ${this.user?.tag}`).debug(`id: ${this.user?.id}`))
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
     * If a UserID is specified and the user exists in the userLogChannels, the 
     * user's custom channel is returned instead.
     */
    public async fetchLogChannel(guild: Guild, type: LoggerChannel = LoggerChannel.default, userID?: Snowflake): Promise<TextChannel> {
        const config = this.fetchConfig(guild)
        if (userID) {
            const channel = config.userLogChannels.get(userID)
            if (channel) {
                return channel
            }
        }
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
    public fetchConfig(guild: Guild): Config {
        return this.configs.get(guild.id) ?? this.loadConfig(guild)
    }

    /**
     * Reads and returns the config file associated with the given guild.
     * The loaded config file is cached and can be retrieved with fetchConfig.
     * It is recomended to use fetchConfig instead of loadConfig, unless the
     * uncached config is required.
     */
    public loadConfig(guild: Guild): Config {
        let data = JSON.parse(fs.readFileSync(fs.existsSync(`${configsDir}/${guild.id}.json`) ? `${configsDir}/${guild.id}.json` : `${configsDir}/default.json`, fileEncoding))

        if (data.version !== configVersion) {
            logger.info(`guild ${guild.id} has outdated config`)
            data = JSON.parse(fs.readFileSync(`${configsDir}/default.json`, fileEncoding))
        }

        const guildConfig = data as Config

        guildConfig.loggerChannels = new Collection<LoggerChannel, TextChannel>(data.loggerChannels instanceof Array ?
            (data.loggerChannels as Array<[number, string]>)
                .filter(value => guild.channels.resolve(value[1])?.isText() ?? false)
                .map<[LoggerChannel, TextChannel]>(([key, value]) => [key as LoggerChannel, guild.channels.resolve(value) as TextChannel])
            : undefined)

        guildConfig.userLogChannels = new Collection<Snowflake, TextChannel>(data.userLogChannels instanceof Array ?
            (data.userLogChannels as Array<[string, string]>)
                .filter(value => guild.channels.resolve(value[1])?.isText() ?? false)
                .map<[Snowflake, TextChannel]>(([key, value]) => [key, guild.channels.resolve(value) as TextChannel])
            : undefined)

        const adminRoles = data.adminRoles
        if (adminRoles instanceof Array)
            guildConfig.adminRoles = new Collection<Snowflake, Role>(
                adminRoles
                    .map<[Snowflake, Role | null]>(id => [id, guild.roles.resolve(id)])
                    .filter<[Snowflake, Role]>((value): value is [Snowflake, Role] => value[1] !== null)
            )
        else
            guildConfig.adminRoles = new Collection()

        const assignableRoles = data.assignableRoles
        if (assignableRoles instanceof Array)
            guildConfig.assignableRoles = new Collection<Snowflake, Role>(
                assignableRoles
                    .map<[Snowflake, Role | null]>(id => [id, guild.roles.resolve(id)])
                    .filter<[Snowflake, Role]>((value): value is [Snowflake, Role] => value[1] !== null)
            )
        else
            guildConfig.assignableRoles = new Collection()

        guildConfig.disabledCommands = new Set(data.disabledCommands)

        this.configs.set(guild.id, guildConfig)
        logger.debug(`loaded config for guild id ${guild.id}`)

        this.saveConfig(guild.id)
        return guildConfig
    }


    public saveConfig(guild: Guild | Snowflake) {
        const id: Snowflake = guild instanceof Guild ? guild.id : guild
        logger.debug(`saving config for guild id ${id}`)
        let data = JSON.stringify(
            this.configs.get(id),
            (_key, value) => {
                if (value instanceof Map || value instanceof Set) {
                    return [...value]
                }
                if (value instanceof TextChannel || value instanceof Role || value instanceof User) {
                    return value.id
                }

                return value
            },
            4
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
