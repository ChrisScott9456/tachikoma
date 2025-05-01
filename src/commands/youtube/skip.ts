import { SlashCommandBuilder } from 'discord.js';
import { Command, PlayerCommand, RunParams } from '../../interfaces/Command';
import { tachikoma } from '../..';
import { replyWrapper } from '../../utils/replyWrapper';
import { EmbedError, EmbedErrorMessages } from '../../utils/errorEmbed';
import { embedWrapper } from '../../utils/embedWrapper';

export class SkipCommand extends Command {
	public aliases: string[] = ['next'];
	readonly slashCommandBuilder = new SlashCommandBuilder()
		.setName(PlayerCommand.SKIP)
		.setDescription('Skips to the next song.')
		.addNumberOption((opt) => opt.setName('position').setDescription('The specific position of a song in the queue you want to skip to').setRequired(false));

	async run({ interaction }: RunParams) {
		const queue = tachikoma.queueCord.getQueue();
		if (queue.length < 1) throw new EmbedError(EmbedErrorMessages.EMPTY_QUEUE);

		const song = queue[0];

		let position;

		if (interaction.isChatInputCommand()) {
			position = interaction.options.getNumber('position') || 0;
		}

		const title = await tachikoma.queueCord.skip(position);
		await replyWrapper({ message: embedWrapper(song, title), interaction });
	}
}
