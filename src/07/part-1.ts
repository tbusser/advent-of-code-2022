import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { recreateFileSystem } from './common.js';
import { Directory } from './Directory.js';

/* ========================================================================== */

function getFolders(directory: Directory, threshold = 100000): number {
	const size = directory.getSize();
	const initialValue = size <= threshold ? size : 0;

	return Array.from(directory.directories).reduce(
		(total, [, subFolder]) => total + getFolders(subFolder),
		initialValue
	);
}

async function findSolution(input: string): Promise<number> {
	// Each terminal line is separated with a new line.
	const terminalLines = input.split('\n');

	// Recreate the file system based on the terminal output.
	const root = recreateFileSystem(terminalLines);

	return getFolders(root);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(7);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Sum of total sizes: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
