import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { createKnots, createMove, executeMove } from './common.js';

/* ========================================================================== */

const NUMBER_OF_KNOTS = 10;
const knots = createKnots(NUMBER_OF_KNOTS);

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	const moves = input.split('\n').map(createMove);

	// Execute all the moves.
	moves.forEach(move => executeMove(move, knots));

	// Return the number of unique visited positions for the last knot.
	return knots[knots.length - 1].numberOfVisitedUniquePositions;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(9);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(
	`Number of unique positions visited by the tail of the rope: ${result.answer}`
);
console.log(`Time taken: ${result.duration}ms`);
