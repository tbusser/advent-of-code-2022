import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { calculateMonkeyBusiness } from './common.js';
import { Monkey } from './Monkey.js';

/* ========================================================================== */

const NUMBER_OF_ROUNDS = 20;

/* ========================================================================== */

async function findSolution(input: string): Promise<number> {
	const monkeyConfigs = input.split('\n\n');

	const monkeys = monkeyConfigs.map(config => Monkey.createMonkey(config));

	for (let round = 0; round < NUMBER_OF_ROUNDS; round++) {
		monkeys.forEach(monkey => {
			const turns = monkey.inspectItems();
			for (const { item, destination } of turns) {
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
