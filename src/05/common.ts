import { RegExpGroups } from '../utils/types.js';

/* ========================================================================== */

type RowRegexResult = RegExpGroups<'crate'>;
type StepRegexResult = RegExpGroups<'amount' | 'fromStack' | 'toStack'>;

type MovementType = 'multiple' | 'single';

/* ========================================================================== */

const stepRegex = /\D+(?<amount>\d+)\D+(?<fromStack>\d+)\D+(?<toStack>\d+)$/;
const rowRegex = /(?:\s{3}|\[(?<crate>\w)\])(?:\s|$)/g;

/* ========================================================================== */

export function applyStep(
	step: string,
	stacks: string[][],
	movementType: MovementType
) {
	// Use a regex to find the numbers in the instruction which we need to
	// follow the procedure.
	const match: StepRegexResult = stepRegex.exec(step);

	// Convert the strings to numbers, for the indexes we need to subtract 1 as
	// our columns start at index 0 instead of 1 like in the instructions.
	const amount = parseInt(match.groups.amount, 10);
	const fromIndex = parseInt(match.groups.fromStack, 10) - 1;
	const toIndex = parseInt(match.groups.toStack, 10) - 1;

	// Get the stacks which need to be altered.
	const fromStack = stacks[fromIndex];
	const toStack = stacks[toIndex];

	// Remove the items from the source stack.
	const items = fromStack.splice(fromStack.length - amount);

	if (movementType === 'single') {
		// In reverse order, add the removed items to the destination stack.
		for (let index = items.length - 1; index >= 0; index--) {
			toStack.push(items[index]);
		}
	} else {
		// Place the removed crates in their original order on top of their
		// destination stack.
		stacks[toIndex] = [...toStack, ...items];
	}
}

export function convertLayoutToStacks(layout: string): string[][] {
	// This will become an array where each item represents a column and its
	// crates. The first item in the array will be crate on the bottom of the
	// column, the last item will be the item on the top of the column.
	const result = [];

	// Take the layout and split it into individual rows.
	const rows = layout.split('\n');

	// The last row contains the row ids, this can be ignored. Start at the
	// second to last row and work back to the first row.
	for (let index = rows.length - 2; index >= 0; --index) {
		const row = rows[index];
		let column: RowRegexResult;
		let columnIndex = 0;

		// Keep matching the regex against the row until there are no more
		// matches to process.
		do {
			column = rowRegex.exec(row);
			// When there is a crate in the column the named group will be
			// something else than undefined.
			if (column?.groups?.crate !== undefined) {
				// Make sure there is an array for the current column in the
				// array with all columns.
				result[columnIndex] ||= [];
				// Add the crate to the column. Because we are working from the
				// last row to the first row the column array will have the
				// crates stored from bottom to top row.
				result[columnIndex].push(column.groups?.crate);
			}
			columnIndex++;
		} while (column);
	}

	return result;
}

export function getTopCrates(stacks: string[][]): string {
	return stacks.reduce(
		(result, stack) => (result += stack[stack.length - 1]),
		''
	);
}
