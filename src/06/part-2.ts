import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { findMarkerEndPosition } from './common.js';

/* ========================================================================== */

const markerSize = 14;

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	return findMarkerEndPosition(input, markerSize);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(6);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(
	`Characters before first start-of-message marker: ${result.answer}`
);
console.log(`Time taken: ${result.duration}ms`);
