import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { createRangePairs, Range } from './common.js';

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	// Each pair is on its own line, split up the input into lines. Per line
	// create the ranges for both elves.
	const pairs = input.split('\n').map(createRangePairs);

	// Count the number of pairs where one range overlaps with the other
	// elf's range.
	return pairs.reduce((total, pair) => {
		return rangeHasOverlap(pair[0], pair[1]) || rangeHasOverlap(pair[1], pair[0])
			? total + 1
			: total;
	}, 0);
}

/**
 * Checks if range B has any overlap with range A.
 */
function rangeHasOverlap(rangeA: Range, rangeB: Range): boolean {
	// There is an overlap with the lower end of range B falls within range A or
	// when the upper end of range B falls within range A.
	return (
		(rangeB.lower >= rangeA.lower && rangeB.lower <= rangeA.upper) ||
		(rangeB.upper >= rangeA.lower && rangeB.upper <= rangeA.upper)
	);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(4);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Number of pairs with a overlap: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
