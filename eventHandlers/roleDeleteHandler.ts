import { Role } from "discord.js"
import { DubiousBot } from ".."

export const roleDeleteHandler = async (role: Role, client: DubiousBot): Promise<void> => {

    let config = client.fetchConfig(role.guild)

    if (config.adminRoles.delete(role.id) || config.assignableRoles.delete(role.id))
        client.saveConfig(role.guild.id)

    if (!config.enableLogger)
        return

    //TODO log
}
