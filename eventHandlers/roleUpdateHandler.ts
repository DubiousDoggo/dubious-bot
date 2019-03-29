import { Role } from "discord.js";
import { DubiousBot } from "..";

export default (role: Role, newrole: Role, client: DubiousBot) => {
	return new Promise<void>((resolve, reject) => {
		let config = client.fetchConfig(role.guild)

		if (!config.enableLogger)
			return resolve()

		//TODO log

		return resolve()
	})

}