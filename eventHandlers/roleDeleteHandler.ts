import { Role } from "discord.js";
import { DubiousBot } from "..";

export default (role: Role, client: DubiousBot) => {
	let config = client.configs.get(role.guild.id)
	if(config !== undefined)
		if(config.adminRoles.delete(role.id) || config.assignableRoles.delete(role.id))
			client.saveConfig(role.guild.id)

}