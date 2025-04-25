import { Snowflake } from 'discord.js';

export interface MovieNightConfig {
	requiredVotes: number;
	failureVotes: number;
	dayOfWeek: number;
	hour: number;
	pollLength: number;
	utcOffset: number;
}

export interface IMDBMovie {
	Title: string;
	Released: string;
	Runtime: string;
	Genre: string;
	Director: string;
	Actors: string;
	Plot: string;
	Poster: string;
	imdbRating: string;
	imdbLink: string;
}

export interface TMDBMovie {
	backdrop_path: string;
	belongs_to_collection: {
		id: number;
		name: string;
		poster_path: string;
		backdrop_path: string;
	};
	genres: [{ id: number; name: string }];
	id: number;
	imdb_id: string;
	overview: string;
	poster_path: string;
	release_date: string;
	runtime: number;
	title: 'Dune: Part Two';
	vote_average: number;
	credits: {
		cast: {
			name: string;
			character: string;
		}[];
		crew: { name: string; job: string }[];
	};
}

export interface Movie {
	id?: number;
	User: Snowflake;
	Title: string;
	'Release Date': string;
	Rating: string;
	Runtime: string;
	Genre: string;
	Director: string;
	Actors: string;
	Synopsis: string;
	Poster: string;
	Backdrop?: string;
	'IMDB Link': string;
	'TMDB Link': string;
	// Collection?: {
	// 	id: number;
	// 	name: string;
	// 	poster_path: string;
	// 	backdrop_path: string;
	// };
}
