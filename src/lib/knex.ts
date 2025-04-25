import knex, { Knex } from 'knex';

const knexConfig: Knex.Config = {
	client: 'sqlite3', // Or another database client like 'pg', 'mysql', etc.
	connection: {
		filename: './config/db.sqlite3', // Adjust the filename or connection details as needed
	},
	useNullAsDefault: true, // This is specific to SQLite; adjust for other databases
};

export const db = knex(knexConfig);

export enum DB_TABLES {
	MOVIE_LIST = 'movielist',
	MOVIE_NIGHT_POLL = 'movienightpoll',
}

export async function createTables() {
	const exists = await db.schema.hasTable(DB_TABLES.MOVIE_LIST);

	if (!exists) {
		await db.schema.createTable(DB_TABLES.MOVIE_LIST, (table) => {
			table.increments('id').primary();
			table.string('User');
			table.string('Title');
			table.string('Release Date');
			table.string('Rating');
			table.string('Runtime');
			table.string('Genre');
			table.string('Director');
			table.string('Actors');
			table.string('Synopsis');
			table.string('Poster');
			table.string('Backdrop');
			table.string('IMDB Link');
			table.string('TMDB Link');
		});

		await db.schema.createTable(DB_TABLES.MOVIE_NIGHT_POLL, (table) => {
			table.integer('id').primary();
			table.string('messageid');
		});
	}
}
