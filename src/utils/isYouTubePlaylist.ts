export function isYouTubePlaylist(url) {
	const youtubePlaylistRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:playlist\?list=)([a-zA-Z0-9_-]+)/;
	return youtubePlaylistRegex.test(url);
}
