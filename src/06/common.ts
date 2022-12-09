export function findMarkerEndPosition(
	input: string,
	markerSize: number
): number {
	let index = 0;
	let uniqueLetters: Set<string>;
	// Create an array of letters from the input.
	const letters = input.split('');

	// Keep progressing through the input letters until an index is found from
	// which a string can be constructed with 4 unique letters.
	do {
		// Create a set of letters starting at the current index and as many as
		// the marker is long. Only when the set has a size equal to the marker
		// size do we know there are no double letters.
		uniqueLetters = new Set(letters.slice(index, index + markerSize));
		if (uniqueLetters.size !== markerSize) {
			index++;
		}
	} while (uniqueLetters.size !== markerSize);

	// The end position is the start position plus the marker size.
	return index + markerSize;
}
