import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { calculateMonkeyBusiness } from './common.js';
import { Monkey } from './Monkey.js';

/* ========================================================================== */

const NUMBER_OF_ROUNDS = 10000;

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	const monkeyConfigs = input.split('\n\n');

	const monkeys = monkeyConfigs.map(config => Monkey.createMonkey(config));

	// To deal with the very large numbers we need to ensure the numbers don't
	// get too large to do calculations with. A way to deal with this is to
	// calculate the common denominator for all the monkeys. This is done by
	// multiplying the testing number by which each monkey divides the worry
	// level. With this common denominator we can perform a modulo operation
	// on the worry level, this will ensure the worry level never exceeds the
	// value of the common denominator.
	const commonDenominator = monkeys.reduce(
		(total, monkey) => total * monkey.testingNumber,
		1
	);

	for (let round = 0; round < NUMBER_OF_ROUNDS; round++) {
		monkeys.forEach(monkey => {
			// Use the common denominator to keep the worry levels manageable.
			const turns = monkey.inspectItems(commonDenominator);
			for (const { destination, item } of turns) {
				monkeys[destination].addItem(item);
			}
		});
	}

	const inspectedItemCount = monkeys.map(monkey => monkey.inspectedItemCount);
	const monkeyBusiness = calculateMonkeyBusiness(inspectedItemCount);

	return monkeyBusiness;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(11);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Level of monkey business after 20 rounds: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
