import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, InteractionResponse, MessageActionRowComponentBuilder, SlashCommandBuilder } from 'discord.js';
import { Command, PlayerCommand, PaginationCommands, RunParams } from '../../interfaces/Command';
import { EmbedError, EmbedErrorMessages } from '../../utils/errorEmbed';
import { replyWrapper } from '../../utils/replyWrapper';
import { QUEUE_PAGE_COUNT } from '../../lib/envVariables';
import { getProgressBar } from '../../utils/getProgressBar';
import { tachikoma } from '../..';
import { Loop } from 'queuecord';

export class QueueCommand extends Command {
	readonly slashCommandBuilder = new SlashCommandBuilder()
		.setName(PlayerCommand.QUEUE)
		.setDescription('Lists the current queue of songs.')
		.addBooleanOption((opt) => opt.setName('simple').setDescription('Only display the currently playing song?').setRequired(false));

	public async run({ interaction }: RunParams, page = 1, simple = false) {
		const queue = tachikoma.queueCord.getQueue();
		if (queue.length < 1) throw new EmbedError(EmbedErrorMessages.EMPTY_QUEUE);

		let simpleFlag: boolean = simple;
		let deferredReply: InteractionResponse<boolean>;

		if (interaction) {
			// If the command was from a chat input, get the options
			if (interaction instanceof ChatInputCommandInteraction) {
				simpleFlag = interaction.options.getBoolean('simple');
			}

			// Defer reply if not already deferred
			if (!interaction.deferred) deferredReply = await interaction.deferReply();
		}

		/*
		 * Set up variables for pagination
		 */
		const sliceQueue = queue.slice(1);

		const song = queue[0]; // The currently playing song

		const timestampStr = `\`${song.getElapsedTimeString()}\`/\`${song.duration_string}\``;

		const startCount = (page - 1) * QUEUE_PAGE_COUNT;
		const endCount = page * QUEUE_PAGE_COUNT;
		const maxPage = Math.ceil(sliceQueue.length / QUEUE_PAGE_COUNT);

		const loop = tachikoma.queueCord.getLoop();

		/*
		 * Media Buttons
		 */
		const previous = new ButtonBuilder().setCustomId(PlayerCommand.PREVIOUS).setEmoji('⏮').setStyle(ButtonStyle.Secondary);
		const stop = new ButtonBuilder().setCustomId(PlayerCommand.STOP).setEmoji('⏹').setStyle(ButtonStyle.Secondary);
		const pause = new ButtonBuilder().setCustomId(PlayerCommand.PAUSE).setEmoji('⏯').setStyle(ButtonStyle.Secondary);
		const skip = new ButtonBuilder().setCustomId(PlayerCommand.SKIP).setEmoji('⏭').setStyle(ButtonStyle.Secondary);
		const shuffle = new ButtonBuilder().setCustomId(PlayerCommand.SHUFFLE).setEmoji('🔀').setStyle(ButtonStyle.Secondary);
		// const loop = new ButtonBuilder().setCustomId(PlayerCommand.LOOP).setEmoji('🔁').setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(previous, stop, pause, skip, shuffle);

		const components = [row];

		/*
		 * Pagination select
		 */
		if (!simpleFlag && sliceQueue.length > QUEUE_PAGE_COUNT) {
			const previousPage = new ButtonBuilder()
				.setCustomId(JSON.stringify({ id: PaginationCommands.PREVIOUS_PAGE, page }))
				.setEmoji('⬅')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(page === 1);
			const pageCount = new ButtonBuilder().setCustomId('page_count').setLabel(`Page: ${page} of ${maxPage}`).setStyle(ButtonStyle.Secondary).setDisabled(true);
			const nextPage = new ButtonBuilder()
				.setCustomId(JSON.stringify({ id: PaginationCommands.NEXT_PAGE, page, maxPage }))
				.setEmoji('➡')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(page >= maxPage);

			const rowTwo = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(previousPage, pageCount, nextPage);
			components.push(rowTwo);
		}

		/*
		 * Reply with queue embed and buttons
		 */
		await replyWrapper({
			message: {
				components,
				embeds: [
					new EmbedBuilder()
						.setColor('Blurple')
						.setTitle('Now Playing')
						.setThumbnail(song.thumbnail)
						.setAuthor({ name: song.interaction.member.displayName, iconURL: song.interaction.member.avatarURL() })
						.setDescription(
							[
								// Song name and hyperlink
								`**[${song.title || song.webpage_url}](${song.webpage_url})**\n`,

								// Display current time left on current song from total song length
								`${getProgressBar(20, song.getElapsedTime() / song.duration)} ${timestampStr}`,

								// Display loop mode if enabled
								loop !== Loop.Disabled ? `\n**🔁 Mode - ${loop}**` : null,

								// If there are any other songs in the queue, display list
								!simpleFlag && sliceQueue.length > 0
									? `### **Queue:**\n${
											sliceQueue
												.slice(startCount, endCount) // First 20 songs in the list
												.map((song, i) => `**${i + 1 + startCount}.** [${song.title || song.webpage_url}](${song.webpage_url}) \`[${song.duration_string}]\``)
												.join('\n') || 'None'
									  }\n`
									: null,
							].join('\n')
						)
						.setFooter({ text: `Source: ${song.channel}` }),
				],
			},
			interaction,
		});
	}
}
