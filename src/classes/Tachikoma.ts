import { Client, ClientOptions } from 'discord.js';
import { DISCORD_TOKEN } from '../lib/envVariables';
import { setDefaultPresence } from '../utils/defaultPresence';
import { QueueCord } from 'queuecord';

export class Tachikoma extends Client {
	public queueCord: QueueCord = new QueueCord();

	constructor(options: ClientOptions) {
		super(options);

		this.initialize();
	}

	async initialize() {
		await this.login(DISCORD_TOKEN);

		setDefaultPresence();
	}
}
