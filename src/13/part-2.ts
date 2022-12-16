import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { compareLists } from './common.js';

const dividerPacketA = [[2]];
const dividerPacketB = [[6]];

/* ========================================================================== */

function convertInputToPackets(input: string): [][][] {
	return input.split('\n').map(line => JSON.parse(line));
}

function findDividerIndexes(packets: number[][][]): number[] {
	// Stringify the divider packets to look for, this way we can do a simple
	// string compare to find the packets we need.
	const dividerA = JSON.stringify(dividerPacketA);
	const dividerB = JSON.stringify(dividerPacketB);

	// Return the indexes of the packets.
	return packets.reduce((result: number[], item, index) => {
		const stringifiedPacket = JSON.stringify(item);
		if (stringifiedPacket === dividerA || stringifiedPacket === dividerB) {
			// According to the instructions the first pair has an index of 1 so
			// we need to always add 1 since JS indexes start at 0.
			result.push(index + 1);
		}

		return result;
	}, []);
}

async function findSolution(input: string): Promise<number> {
	// Split the input up into pairs.
	const pairs = input.split('\n\n');
	// Reduce the pairs into an array of packets. Use the two divider packets as
	// the initial value so the result will have all the packets from the input
	// as well as the two divider packets.
	const packets = pairs.reduce(
		(result, pair) => {
			return [...result, ...convertInputToPackets(pair)];
		},
		[dividerPacketA, dividerPacketB]
	);

	// Sort the packets into the correct order.
	packets.sort(sortPackets);
	// Find the indexes for the two divider packets.
	const dividerIndexes = findDividerIndexes(packets);
	// Calculate the decoder key for the distress signal
	return dividerIndexes.reduce((result, index) => result * index, 1);
}

function sortPackets(a, b): number {
	// Compare the to two lists to see if they're in the correct order.
	const isInOrder = compareLists(a, b);

	// When the two lists are identical the result should be 0.
	if (isInOrder === undefined) {
		return 0;
	}

	// Convert the boolean to a number the sort method know how to
	// interpret. When the lists are in the correct order the sort method
	// expects a value of -1.
	return isInOrder ? -1 : 1;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(13);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`The decoder key for the distress signal: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
