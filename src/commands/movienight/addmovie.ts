import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command, RunParamsChat } from '../../interfaces/Command';
import { replyWrapper } from '../../utils/replyWrapper';
import { EmbedError, EmbedErrorMessages } from '../../utils/errorEmbed';
import axios from 'axios';
import { OMDB_API_KEY, TMDB_API_KEY } from '../../lib/envVariables';
import { IMDBMovie, Movie, TMDBMovie } from '../../interfaces/MovieNight';
import { db, DB_TABLES } from '../../lib/knex';

export class AddMovieCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder()
		.setName('addmovie')
		.setDescription('Add a movie to the current list.')
		.addStringOption((opt) => opt.setName('link').setDescription('A valid link from IMDB or TMDB').setRequired(true));

	async run({ interaction }: RunParamsChat) {
		const link = interaction.options.getString('link', true);
		const isIMDB = validateLinkIMDB(link);
		const isTMDB = validateLinkTMDB(link);

		if (!isIMDB && !isTMDB) throw new EmbedError(EmbedErrorMessages.INVALID_LINK);

		let imdbId: string;
		let tmdbId: string = extractTMDbId(link);
		let imdbResponse: IMDBMovie;

		if (isIMDB) {
			imdbId = extractIMDBId(link);

			imdbResponse = (await axios.post<IMDBMovie>(`http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`)).data;

			const searchTMDBResponse = (
				await axios.get<any>(`https://api.themoviedb.org/3/search/movie`, {
					params: {
						api_key: TMDB_API_KEY,
						query: imdbResponse.Title,
					},
				})
			).data;

			tmdbId = searchTMDBResponse.results[0].id;
		}

		const tmdbResponse = (
			await axios.get<TMDBMovie>(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
				params: {
					api_key: TMDB_API_KEY,
					append_to_response: 'credits',
				},
			})
		).data;

		let outMovie: Movie = {
			User: interaction.member.id,
			Title: tmdbResponse.title,
			'Release Date': tmdbResponse.release_date,
			Rating: `${tmdbResponse.vote_average}`,
			Runtime: `${tmdbResponse.runtime}`,
			Genre: tmdbResponse.genres.map((genre) => genre.name).join(', '),
			Director: tmdbResponse.credits.crew.find((crew) => crew.job === 'Director').name,
			Actors:
				'\n' +
				tmdbResponse.credits.cast
					.slice(0, 10)
					.map((cast) => `• ${cast.name} - ${cast.character}\n`)
					.join(''),
			Synopsis: tmdbResponse.overview,
			Poster: `https://image.tmdb.org/t/p/original${tmdbResponse.poster_path}`,
			Backdrop: `https://image.tmdb.org/t/p/original${tmdbResponse.backdrop_path}`,
			'IMDB Link': `https://www.imdb.com/title/${tmdbResponse.imdb_id}`,
			'TMDB Link': `https://www.themoviedb.org/movie/${tmdbId}`,
			// Collection: {
			// 	id: tmdbResponse.belongs_to_collection.id,
			// 	name: tmdbResponse.belongs_to_collection.name,
			// 	poster_path: tmdbResponse.belongs_to_collection.poster_path,
			// 	backdrop_path: tmdbResponse.belongs_to_collection.backdrop_path,
			// },
		};

		// Map to IMDB Response if no TMDB Response
		if (!tmdbResponse || (imdbId && tmdbResponse.imdb_id !== imdbId)) {
			outMovie = {
				User: interaction.member.id,
				Title: imdbResponse.Title,
				'Release Date': imdbResponse.Released,
				Rating: imdbResponse.imdbRating,
				Runtime: imdbResponse.Runtime,
				Genre: imdbResponse.Genre,
				Director: imdbResponse.Director,
				Actors: imdbResponse.Actors,
				Synopsis: imdbResponse.Plot,
				Poster: imdbResponse.Poster,
				'IMDB Link': `https://www.imdb.com/title/${imdbId}`,
				'TMDB Link': `https://www.themoviedb.org/movie/${tmdbId}`,
			};
		}

		const id = await db<Movie>(DB_TABLES.MOVIE_LIST).insert(outMovie);

		delete outMovie.User;

		await replyWrapper({
			message: {
				embeds: [
					new EmbedBuilder()
						.setColor(0x00ff00)
						.setTitle('Movie Added')
						.setImage(outMovie.Poster)
						.setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.avatarURL() })
						.setDescription(
							[
								`### **ID:** ${id[0]}\n`,
								`### **User:**\n <@${interaction.member.id}>\n`,
								Object.entries(outMovie)
									.map((param) => `### **${param[0]}:**\n ${param[1]}`)
									.join('\n'),
							].join('')
						),
				],
			},
			interaction,
		});
	}
}

function validateLinkIMDB(imdb: string) {
	const regex = /^https:\/\/www\.imdb\.com\/title\/(tt\d{7,8}).*/;
	return regex.test(imdb);
}

function validateLinkTMDB(imdb: string) {
	const regex = /https:\/\/www\.themoviedb\.org\/movie\/(\d+)(?:-[\w-]+)?/;
	return regex.test(imdb);
}

function extractIMDBId(url: string) {
	const regex = /tt\d{7,8}/;
	const match = url.match(regex);
	return match ? match[0] : null;
}

function extractTMDbId(url: string): string | null {
	const regex = /https:\/\/www\.themoviedb\.org\/movie\/(\d+)(?:-[\w-]+)?/;
	const match = url.match(regex);
	return match ? match[1] : null;
}
