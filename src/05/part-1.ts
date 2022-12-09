import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { applyStep, convertLayoutToStacks, getTopCrates } from './common.js';

/* ========================================================================== */

function findSolution(input: string): string {
	// The layout of the crates and the rearrangement procedure are separated by
	// an empty line.
	const [layout, procedure] = input.split('\n\n');

	// Convert the text layout to stack which can be manipulated.
	const stacks = convertLayoutToStacks(layout);
	// Every step of the rearrangement procedure is on its own line.
	const steps = procedure.split('\n');

	// Apply all the steps in the rearrangement procedure on the stacks.
	steps.forEach(line => {
		applyStep(line, stacks, 'single');
	});

	// Return the names of the crates which are on top of the stacks.
	return getTopCrates(stacks);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(5);
const result = await measure<string>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`The crates on top: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
