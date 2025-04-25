import { Client, ClientOptions } from 'discord.js';
import { DISCORD_TOKEN } from '../lib/envVariables';
import { setDefaultPresence } from '../utils/defaultPresence';

export class MyClient extends Client {
	constructor(options: ClientOptions) {
		super(options);

		this.initialize();
	}

	async initialize() {
		await this.login(DISCORD_TOKEN);

		setDefaultPresence();
	}
}
