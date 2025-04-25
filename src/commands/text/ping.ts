import { SlashCommandBuilder } from 'discord.js';
import { Command, RunParams } from '../../interfaces/Command';
import { replyWrapper } from '../../utils/replyWrapper';

export class PingCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder().setName('ping').setDescription('Pong!');

	async run({ interaction }: RunParams) {
		await replyWrapper({ message: 'Pong!', interaction });
	}
}
