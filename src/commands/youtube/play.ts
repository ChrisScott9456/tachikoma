import { SlashCommandBuilder } from 'discord.js';
import { Command, PlayerCommand, RunParamsChat } from '../../interfaces/Command';
import { EmbedError, EmbedErrorMessages } from '../../utils/errorEmbed';
import { Tachikoma } from '../../classes/Tachikoma';
import { isYouTubePlaylist } from '../../utils/isYouTubePlaylist';

export class PlayCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder()
		.setName(PlayerCommand.PLAY)
		.setDescription('Plays a video or playlist from YouTube.')
		.addStringOption((opt) => opt.setName('input').setDescription('A YouTube video or playlist URL, or search terms').setRequired(true))
		.addBooleanOption((opt) => opt.setName('shuffle').setDescription('Shuffle the input playlist?').setRequired(false));

	async run({ interaction }: RunParamsChat) {
		const input = interaction.options.getString('input', true);
		const shuffle = interaction.options.getBoolean('shuffle', false) ?? false;
		const vc = interaction.member?.voice?.channel;

		if (!vc) throw new EmbedError(EmbedErrorMessages.VOICE_CHANNEL_REQUIRED);

		await interaction.reply(`Queueing ${isYouTubePlaylist(input) ? 'Playlist' : 'Song'}...`);
		await Tachikoma.queueCord.addToQueue(input, vc);
	}
}
