import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command, PlayerCommand, RunParams } from '../../interfaces/Command';
import { tachikoma } from '../..';
import { replyWrapper } from '../../utils/replyWrapper';
import { EmbedError, EmbedErrorMessages } from '../../utils/errorEmbed';

export class StopCommand extends Command {
	public aliases: string[] = ['clear'];
	readonly slashCommandBuilder = new SlashCommandBuilder().setName(PlayerCommand.STOP).setDescription('Stops playing and clears the queue.');

	async run({ interaction }: RunParams) {
		const queue = tachikoma.queueCord.getQueue();
		if (queue.length < 1) throw new EmbedError(EmbedErrorMessages.EMPTY_QUEUE);

		tachikoma.queueCord.stop();
		await replyWrapper({
			message: {
				embeds: [new EmbedBuilder().setColor('Blurple').setTitle('Stopped').setDescription('Cleared the queue.')],
			},
			interaction,
		});
	}
}
