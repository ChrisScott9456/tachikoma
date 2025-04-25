import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command, RunParamsChat } from '../../interfaces/Command';
import { replyWrapper } from '../../utils/replyWrapper';
import { db, DB_TABLES } from '../../lib/knex';
import { Movie } from '../../interfaces/MovieNight';

export class MovieListCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder()
		.setName('movielist')
		.setDescription('Lists the current movie list.')
		.addBooleanOption((opt) => opt.setName('simple').setDescription('Only display movie titles?'));

	async run({ interaction }: RunParamsChat) {
		const simple = interaction.options.getBoolean('simple');

		const movies = await db<Movie>(DB_TABLES.MOVIE_LIST).select('*');

		if (movies.length > 0) {
			for (const movie of movies) {
				const fields = [
					`### **ID:** ${movie.id}`,
					`### **User:**\n <@${movie.User}>`,
					`### **Title:**\n ${movie.Title} (${movie['Release Date'].slice(0, 4)})`,
					`### **Release Date:**\n ${movie['Release Date']}`,
					`### **Runtime:**\n ${movie.Runtime}`,
					`### **Synopsis:**\n ${movie.Synopsis}`,
					`### **IMDB Link:**\n ${movie['IMDB Link']}`,
					`### **TMDB Link:**\n ${movie['TMDB Link']}`,
				];

				await replyWrapper({
					message: {
						embeds: [
							new EmbedBuilder()
								.setColor('Blurple')
								.setTitle('Movie List')
								.setThumbnail(movie.Poster)
								.setDescription((simple ? fields.slice(0, 3) : fields).join('\n')), // If simple = true, only display user and title
						],
					},
					interaction,
				});
			}
		} else {
			await replyWrapper({
				message: {
					embeds: [new EmbedBuilder().setColor(0xff0000).setTitle('Movie List').setDescription('The current movie list is empty!')],
				},
				interaction,
			});
		}
	}
}
