import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { executeInstructions, loadInstructions } from './ProcessingUnit.js';

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	const instructions = input.split('\n');
	let signalStrengths = 0;

	// Load the instructions into the processing unit.
	loadInstructions(instructions);
	// Create an executor to execute the loaded instructions.
	const executor = executeInstructions();

	// Execute all instructions, for each instruction (cycle) the executor will
	// make the register value available.
	for (const { cycle, value } of executor) {
		// Check if the value is for a cycle we're interested in. These are the
		// 20, 60, 100, 140, 180, and 220 cycle.
		if (cycle % 40 === 20 && cycle <= 220) {
			// Calculate the signal strength for the cycle and add it to the
			// total strength.
			signalStrengths += cycle * value;
		}
	}

	return signalStrengths;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(10);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`The sum of the six signal strengths: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
