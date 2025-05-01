import { SlashCommandBuilder } from 'discord.js';
import { Command, PlayerCommand, RunParams } from '../../interfaces/Command';
import { tachikoma } from '../..';
import { replyWrapper } from '../../utils/replyWrapper';
import { EmbedError, EmbedErrorMessages } from '../../utils/errorEmbed';
import { QueueCordEvents } from 'queuecord';
import { embedWrapper } from '../../utils/embedWrapper';

export class PreviousCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder().setName(PlayerCommand.PREVIOUS).setDescription('Plays the previously queued song, if one exists.');

	async run({ interaction }: RunParams) {
		try {
			await tachikoma.queueCord.previous();
		} catch (error) {
			console.log(error);
			if ((error as Error).message.includes('No previous song available')) {
				throw new EmbedError(EmbedErrorMessages.NO_PREVIOUS_SONGS);
			}
		}

		const queue = tachikoma.queueCord.getQueue();
		if (queue.length < 1) throw new EmbedError(EmbedErrorMessages.EMPTY_QUEUE);

		const song = queue[0];

		await replyWrapper({ message: embedWrapper(song, QueueCordEvents.Previous), interaction });
	}
}
