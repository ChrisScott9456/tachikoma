import { Command } from '../interfaces/Command';
import { AddMovieCommand } from './movienight/addmovie';
import { DeleteMovieCommand } from './movienight/deletemovie';
import { ForceMovieNightCommand } from './movienight/forcemovienight';
import { MovieListCommand } from './movienight/movielist';
import { PingCommand } from './text/ping';
// import { LoopCommand } from './youtube/loop';
import { PauseCommand } from './youtube/pause';
import { PlayCommand } from './youtube/play';
// import { PreviousCommand } from './youtube/previous';
import { QueueCommand } from './youtube/queue';
// import { SeekCommand } from './youtube/seek';
import { ShuffleCommand } from './youtube/shuffle';
import { SkipCommand } from './youtube/skip';
import { StopCommand } from './youtube/stop';

export const Commands = new Map<string, Command>();

// Register all commands in the Commands Map
[
	AddMovieCommand,
	DeleteMovieCommand,
	ForceMovieNightCommand,
	MovieListCommand,
	// LoopCommand,
	PauseCommand,
	PingCommand,
	PlayCommand,
	// PreviousCommand,
	QueueCommand,
	// SeekCommand,
	ShuffleCommand,
	SkipCommand,
	StopCommand,
].forEach((Command) => {
	const command = new Command();
	Commands.set(command.slashCommandBuilder.name, command);

	// If the command has any aliases, add them to the Commands Map
	if (command.aliases) {
		command.aliases.forEach((alias) => {
			const aliasCommand = new Command();

			aliasCommand.slashCommandBuilder.setDescription(`${command.slashCommandBuilder.description} (Alias of /${command.slashCommandBuilder.name})`);
			aliasCommand.slashCommandBuilder.setName(alias);

			Commands.set(alias, aliasCommand);
		});
	}
});
