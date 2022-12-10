import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

/* ========================================================================== */

function calculateTotalCalories(items: string): number {
	return items
		.split('\n')
		.reduce((total, item) => total + parseInt(item, 10), 0);
}

async function findSolution(): Promise<number> {
	// Split the input to items per elf, do this by splitting the text up per
	// double new line.
	const itemsPerElf = input.split('\n\n');

	// Calculate per elf how many calories they're carrying.
	const caloriesPerElf = itemsPerElf.map(calculateTotalCalories);

	// Sort the calories per elf, from lowest to highest.
	caloriesPerElf.sort();

	// Take the last three items, these are the totals of the elves carrying the
	// most calories.
	const topThree = caloriesPerElf.slice(-3);

	// Sum up the calories of the top three elves and return the result.
	return topThree.reduce((total, item) => total + item, 0);
}

/* ========================================================================== */

// Get the input for the puzzle.
const input = await fetchInputForDay(1);
const result = await measure(() => findSolution());

/* -------------------------------------------------------------------------- */

console.log(`The top three elves carry of total ${result.answer} calories.`);
console.log(`Time taken: ${result.duration}ms`);
