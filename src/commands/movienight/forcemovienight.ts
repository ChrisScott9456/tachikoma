import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';
import { getChannel, rollMovie } from '../../utils/poll';

export class ForceMovieNightCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder().setName('forcemovienight').setDescription('Forces the bot to roll the current movie list for movie night.');

	async run() {
		const movieNightChannel = await getChannel();
		await rollMovie(movieNightChannel);
	}
}
