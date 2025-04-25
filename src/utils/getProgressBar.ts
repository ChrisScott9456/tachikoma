export function getProgressBar(width: number = 10, progress: number): string {
	const dotPosition = Math.floor(width * progress);

	let res = '';

	for (let i = 0; i < width; i++) {
		if (i === dotPosition) {
			res += '🔘';
		} else {
			res += '▬';
		}
	}

	return res;
}
