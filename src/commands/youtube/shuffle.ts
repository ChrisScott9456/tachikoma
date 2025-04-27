import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command, PlayerCommand, RunParams } from '../../interfaces/Command';
import { tachikoma } from '../..';
import { replyWrapper } from '../../utils/replyWrapper';
import { EmbedError, EmbedErrorMessages } from '../../utils/errorEmbed';

export class ShuffleCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder().setName(PlayerCommand.SHUFFLE).setDescription('Shuffles the current queue of songs.');

	async run({ interaction, channel }: RunParams) {
		const queue = tachikoma.queueCord.getQueue();
		if (queue.length < 1) throw new EmbedError(EmbedErrorMessages.EMPTY_QUEUE);

		tachikoma.queueCord.shuffle();
		await replyWrapper({
			message: {
				embeds: [new EmbedBuilder().setColor('Blurple').setTitle('Shuffled')],
			},
			interaction,
			channel,
		});
	}
}
