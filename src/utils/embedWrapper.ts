import { EmbedBuilder } from 'discord.js';
import { Song } from 'queuecord';

export function embedWrapper(song: Song, title: string) {
	return {
		embeds: [
			new EmbedBuilder()
				.setColor('Blurple')
				.setTitle(title)
				.setThumbnail(song.thumbnail)
				.setAuthor({ name: song.interaction.member.displayName, iconURL: song.interaction.member.avatarURL() })
				.setDescription(`**[${song.title || song.webpage_url}](${song.webpage_url})**\n`),
		],
	};
}
