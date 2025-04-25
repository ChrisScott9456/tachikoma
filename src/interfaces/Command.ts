import { ButtonInteraction, ChatInputCommandInteraction, GuildTextBasedChannel, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, Snowflake } from 'discord.js';

export interface RunParams {
	interaction?: ChatInputCommandInteraction | ButtonInteraction;
	channel?: GuildTextBasedChannel;
}

export interface RunParamsButton extends RunParams {
	interaction?: ButtonInteraction;
}

export interface RunParamsChat {
	interaction?: ChatInputCommandInteraction<'cached'>;
}

export abstract class Command {
	abstract readonly slashCommandBuilder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	abstract run({ interaction, channel }: RunParams): Promise<void>;
	public aliases: string[];
}

export enum DisTubeCommand {
	LOOP = 'loop',
	PAUSE = 'pause',
	PLAY = 'play',
	PREVIOUS = 'previous',
	QUEUE = 'queue',
	SEEK = 'seek',
	SHUFFLE = 'shuffle',
	SKIP = 'skip',
	STOP = 'stop',
}

export enum PaginationCommands {
	PREVIOUS_PAGE = 'previous_page',
	NEXT_PAGE = 'next_page',
}

export interface PaginationCustomId {
	id: PaginationCommands;
	page: number;
}
