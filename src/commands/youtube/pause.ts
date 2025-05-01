import { SlashCommandBuilder } from 'discord.js';
import { Command, PlayerCommand, RunParams } from '../../interfaces/Command';
import { tachikoma } from '../..';
import { replyWrapper } from '../../utils/replyWrapper';
import { EmbedError, EmbedErrorMessages } from '../../utils/errorEmbed';
import { embedWrapper } from '../../utils/embedWrapper';

export class PauseCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder().setName(PlayerCommand.PAUSE).setDescription('Pauses or unpauses the current song.');

	async run({ interaction }: RunParams) {
		const queue = tachikoma.queueCord.getQueue();
		if (queue.length < 1) throw new EmbedError(EmbedErrorMessages.EMPTY_QUEUE);

		const state = await tachikoma.queueCord.pause();

		const song = queue[0];
		await replyWrapper({ message: embedWrapper(song, state), interaction });
	}
}
