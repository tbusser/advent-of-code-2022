export interface Range {
	lower: number;
	upper: number;
}

/* ========================================================================== */

function convertInputToRange(input: string): Range {
	const limits = input.split('-');

	return {
		lower: parseInt(limits[0], 10),
		upper: parseInt(limits[1], 10)
	};
}

/**
 * Splits the input on the comma.
 */
function createPairs(input: string): string[] {
	return input.split(',');
}

/* ========================================================================== */

/**
 * Creates a pair of ranges for a single input line.
 */
export function createRangePairs(input: string): Range[] {
	return createPairs(input).map(convertInputToRange);
}
