import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { compareLists } from './common.js';

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	// The pairs are split by a new line.
	const pairs = input.split('\n\n');
	let result = 0;
	// Iterate over all the pairs.
	pairs.forEach((pair, index) => {
		// Check if the pairs are in the right order, if they are add the index
		// to the sum. According to the instructions the first pair has an index
		// of 1 so we need to always add 1 since JS indexes start at 0.
		if (hasCorrectOrder(pair)) {
			result += index + 1;
		}
	});

	return result;
}

function hasCorrectOrder(pair: string): boolean {
	// The two packets are separated by a new line. Split the input up and
	// convert them into arrays. The packets are valid JSON so we can use the
	// JSON parser to convert the input.
	const [a, b] = pair.split('\n').map(packet => JSON.parse(packet));

	return compareLists(a, b);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(13);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Sum of indices of pairs in the right order: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
