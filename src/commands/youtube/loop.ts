import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command, PlayerCommand, RunParams } from '../../interfaces/Command';
import { tachikoma } from '../..';
import { replyWrapper } from '../../utils/replyWrapper';

export class LoopCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder().setName(PlayerCommand.LOOP).setDescription('Cycles through the loop modes: Disabled -> Song -> Queue');

	async run({ interaction }: RunParams) {
		const mode = await tachikoma.queueCord.loop();
		await replyWrapper({
			message: {
				embeds: [new EmbedBuilder().setColor('Blurple').setTitle('Loop').setDescription(`🔁 Mode - **${mode}**`)],
			},
			interaction,
		});
	}
}
