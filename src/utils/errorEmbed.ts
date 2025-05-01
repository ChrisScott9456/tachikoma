import { EmbedBuilder, InteractionReplyOptions } from 'discord.js';

export enum EmbedErrorMessages {
	GENERAL_ERROR = 'There was an error executing that command!',
	EMPTY_QUEUE = 'There are no songs in the queue!',
	VOICE_CHANNEL_REQUIRED = 'You must be in a voice channel to use this command!',
	NO_PREVIOUS_SONGS = 'There are no previous songs in the queue to play!',
	SEEK_ERROR = 'You cannot seek to a timestamp outside the length of the song!',
	INVALID_LINK = 'Invalid IMDB/TMDB link! The link should be one of these formats: https://www.imdb.com/title/tt15239678 \n OR \n https://www.themoviedb.org/movie/693134',
}

export class EmbedError extends Error {
	readonly embedMessage: EmbedErrorMessages;

	constructor(error: EmbedErrorMessages) {
		super(error);
		this.embedMessage = error;
	}
}

export function errorEmbed(errorMessage: EmbedErrorMessages, ephemeral: boolean = true): InteractionReplyOptions {
	// Always publicly show GENERAL_ERROR
	if (errorMessage === EmbedErrorMessages.GENERAL_ERROR) ephemeral = false;

	return {
		flags: ephemeral ? 'Ephemeral' : null, // If true, only display to the user
		embeds: [new EmbedBuilder().setColor(0xff0000).setDescription(`**${errorMessage}**`)],
	};
}
