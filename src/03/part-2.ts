import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { convertItemToPriority } from './common.js';

/* ========================================================================== */

/**
 * The number of elves per group.
 */
const GROUP_SIZE = 3;

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	// The content of each rucksack is on its own line.
	const rucksacks: string[] = input.split('\n');

	let total = 0;

	// Iterate over all the rucksacks in steps of three, this way we can make
	// groups of three rucksacks.
	for (let index = 0; index < rucksacks.length; index = index + GROUP_SIZE) {
		// Get the rucksacks which together form a group.
		const groupRucksacks = rucksacks.slice(index, index + GROUP_SIZE);

		// Find the priority of the item shared between all the rucksacks in
		// the group.
		total += findGroupPriority(groupRucksacks);
	}

	return total;
}

function findGroupPriority(rucksacks: string[]): number {
	// Split the content of the first compartment up into its individual items.
	const items = rucksacks[0].split('');

	// Find the item which is also included in the other two rucksacks.
	const sharedItem = items.find(
		item => rucksacks[1].includes(item) && rucksacks[2].includes(item)
	);

	return convertItemToPriority(sharedItem);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(3);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`The sum of the badge priorities is: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
