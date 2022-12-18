import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { Cave } from './Cave.js';

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	const cave = new Cave(input);
	let numberOfGrains = 0;

	while (cave.dropGrain()) {
		numberOfGrains++;
	}

	return numberOfGrains;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(14);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Units of sand until it flow into the abyss: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
