import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { executeInstructions, loadInstructions } from './ProcessingUnit.js';

/* ========================================================================== */

const MAX_LINE_LENGTH = 40;

/* ========================================================================== */

async function findSolution(input: string): Promise<string> {
	const instructions = input.split('\n');
	let output = '';

	// Load the instructions into the processing unit.
	loadInstructions(instructions);
	// Create an executor to execute the loaded instructions.
	const executor = executeInstructions();

	// Execute all instructions, for each instruction (cycle) the executor will
	// make the register value available.
	for (const { cycle, value } of executor) {
		// Get the value of the register during the current cycle. Since each
		// row has an index between 0 and 39 we need to adjust the cycle to
		// stay in between these bounds. The -1 is needed because cycle starts
		// at 1 but the output starts at 0.
		const adjustedCycle = (cycle - 1) % MAX_LINE_LENGTH;
		// The value is the middle position of the sprite, check if the register
		// value falls within the area covered by the sprite.
		output +=
			value >= adjustedCycle - 1 && value <= adjustedCycle + 1 ? '█' : ' ';
	}

	return output;
}

function logTerminalOutput(output: string): void {
	// Create chunks of 40 characters and log them to the console.
	for (let index = 0; index < output.length; index += MAX_LINE_LENGTH) {
		console.log(output.substring(index, index + MAX_LINE_LENGTH));
	}
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(10);
const result = await measure<string>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log('Terminal output:');
logTerminalOutput(result.answer);
console.log(`Time taken: ${result.duration}ms`);
