import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { recreateFileSystem } from './common.js';
import { Directory } from './Directory.js';

/* ========================================================================== */

interface BestFit {
	delta: number;
	size: number;
}

/* ========================================================================== */

const MAX_CAPACITY = 70000000;
const REQUIRED_FREE_SPACE = 30000000;

const initialBestFit: BestFit = {
	// Set the delta to infinity so the first evaluated directory will always
	// have a smaller delta.
	delta: Infinity,
	size: 0
};

/* ========================================================================== */

function calculateSpaceToFree(root: Directory): number {
	// Calculate how much space is still available.
	const availableSpace = MAX_CAPACITY - root.getSize();

	// Calculate how more space is needed to free up the space required to run
	// the update.
	return REQUIRED_FREE_SPACE - availableSpace;
}

function findBestFittingFolder(
	directory: Directory,
	targetSize: number,
	bestFit: BestFit
): BestFit {
	const directorySize = directory.getSize();
	// The directory is big enough when deleting it will free up at least the
	// target size.
	const isBigEnough = directorySize >= targetSize;
	// Calculate how much more free space is created than needed to run
	// the update.
	const delta = directorySize - targetSize;
	// When the current directory is a closer match than the current best fit,
	// continue with the current directory.
	const initialValue =
		isBigEnough && delta < bestFit.delta
			? { size: directorySize, delta }
			: bestFit;

	// Iterate over the subdirectories of the current directory and see if there
	// is a folder which is a better match. When there are no subdirectories the
	// result will be the current best fit.
	return Array.from(directory.directories).reduce((result, [, subFolder]) => {
		// See if the subdirectory has any directories which are smaller than
		// the current best fit.
		return findBestFittingFolder(subFolder, targetSize, result);
	}, initialValue);
}

async function findSolution(input: string): Promise<number> {
	// Each terminal line is separated with a new line.
	const terminalLines = input.split('\n');

	// Recreate the file system based on the terminal output.
	const root = recreateFileSystem(terminalLines);
	const spaceToFree = calculateSpaceToFree(root);

	console.log(`Space to free: ${spaceToFree}`);

	return findBestFittingFolder(root, spaceToFree, initialBestFit).size;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(7);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Size of best fitting folder: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
