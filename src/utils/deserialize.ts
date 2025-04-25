export function deserialize<T>(input: string): T {
	let out: T;

	try {
		out = JSON.parse(input);
	} catch (e) {
		return;
	}

	return out;
}
