import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { convertItemToPriority } from './common.js';

/* ========================================================================== */

/**
 * Divides the content of the rucksack into two equally sized compartments.
 */
export function convertRucksackToCompartments(content: string): string[] {
	// A compartment contains the half of the content of the whole rucksack.
	const compartmentSize = content.length / 2;

	return [content.slice(0, compartmentSize), content.slice(compartmentSize)];
}

async function findSolution(input: string): Promise<number> {
	// The content of each rucksack is on its own line.
	const rucksacks: string[] = input.split('\n');

	// Calculate the total of all the priorities of the shared items
	// per rucksack.
	return rucksacks.reduce(
		(total, rucksack) => total + getSharedItemPriority(rucksack),
		0
	);
}

function getSharedItemPriority(rucksack: string): number {
	// Each compartment contains half of the rucksack content, divide the
	// content evenly.
	const [firstCompartment, secondCompartment] =
		convertRucksackToCompartments(rucksack);
	// Split the content of the first compartment up into its individual items.
	const items: string[] = firstCompartment.split('');

	// Find the item from this first compartment which is also present in the
	// second compartment.
	const sharedItem = items.find(item => secondCompartment.includes(item));

	return convertItemToPriority(sharedItem);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(3);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
