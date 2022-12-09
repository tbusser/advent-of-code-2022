import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

/* ========================================================================== */

function calculateTotalCalories(items: string): number {
	return items
		.split('\n')
		.reduce((total, item) => total + parseInt(item, 10), 0);
}

async function findSolution(input: string): Promise<number> {
	// Split the input to items per elf, do this by splitting the text up per
	// double new line.
	const itemsPerElf = input.split('\n\n');

	// Calculate per elf how many calories they're carrying.
	const caloriesPerElf = itemsPerElf.map(calculateTotalCalories);

	// Get the highest calory count of all the elves.
	return Math.max(...caloriesPerElf);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput = await fetchInputForDay(1);
const result = await measure(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(
	`The most calories carried by an elf is ${result.answer} calories.`
);
console.log(`Time taken: ${result.duration}ms`);
