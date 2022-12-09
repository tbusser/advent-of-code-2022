import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { createRangePairs, Range } from './common.js';

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	// Each pair is on its own line, split up the input into lines. Per line
	// create the ranges for both elves.
	const pairs = input.split('\n').map(createRangePairs);

	// Count the number of pairs where one range fully contains the other
	// elf's range.
	return pairs.reduce((total, pair) => {
		return rangeContains(pair[0], pair[1]) || rangeContains(pair[1], pair[0])
			? total + 1
			: total;
	}, 0);
}

/**
 * Checks if range B completed falls within range A.
 */
function rangeContains(rangeA: Range, rangeB: Range): boolean {
	return rangeA.lower <= rangeB.lower && rangeA.upper >= rangeB.upper;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(4);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Number of pairs with a full overlap: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
