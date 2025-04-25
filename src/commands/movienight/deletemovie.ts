import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command, RunParamsChat } from '../../interfaces/Command';
import { replyWrapper } from '../../utils/replyWrapper';
import { Movie } from '../../interfaces/MovieNight';
import { db, DB_TABLES } from '../../lib/knex';

export class DeleteMovieCommand extends Command {
	public aliases: string[] = ['delmovie'];
	readonly slashCommandBuilder = new SlashCommandBuilder()
		.setName('deletemovie')
		.setDescription('Delete a movie from the current list.')
		.addStringOption((opt) => opt.setName('id').setDescription('The ID of the movie').setRequired(true));

	async run({ interaction }: RunParamsChat) {
		const id = JSON.parse(interaction.options.getString('id', true));

		const movie = (await db<Movie>(DB_TABLES.MOVIE_LIST).where({ id }))[0];

		if (movie) {
			await db<Movie>(DB_TABLES.MOVIE_LIST).where({ id }).delete();

			const fields = [`### **ID:** ${movie.id}`, `### **User:**\n <@${movie.User}>`, `### **Title:**\n ${movie.Title} (${movie['Release Date'].slice(0, 4)})`];

			await replyWrapper({
				message: {
					embeds: [new EmbedBuilder().setColor('Red').setTitle('Deleted Movie From List').setThumbnail(movie.Poster).setDescription(fields.join('\n'))],
				},
				interaction,
			});
		} else {
			await replyWrapper({
				message: {
					embeds: [new EmbedBuilder().setColor(0xff0000).setTitle('Movie List').setDescription(`A movie with the ID: **${id}** is not in the current list!`)],
				},
				interaction,
			});
		}
	}
}
