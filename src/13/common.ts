function convertToArray(value: number | number[]): number[] {
	return Array.isArray(value) ? value : [value];
}

/* ========================================================================== */

/**
 * Compares a pair of values to determine whether or not they adhere to the
 * rules for a properly ordered pair.
 *
 * @returns The result is undefined when the pairs are identical. Otherwise
 *          the result is true when the pairs are in the right order and
 *          false when they're not in the right order.
 */
// eslint-disable-next-line complexity
export function compareLists(leftPacket, rightPacket): boolean | undefined {
	// Get the highest item count of the two pairs, this determines the number
	// of value we have to inspect.
	const maxIndex = Math.max(leftPacket.length, rightPacket.length);

	// Iterate over the values until we've determined the pairs to be in the
	// right or in the wrong order.
	for (let index = 0; index < maxIndex; index++) {
		const leftValue = leftPacket[index];
		const rightValue = rightPacket[index];

		// Check of either packet has run out of values.
		if (leftValue === undefined || rightValue === undefined) {
			// When the left packet runs out of values before the right packet
			// does the pair is considered to be valid.
			return leftValue === undefined ? true : false;
		}

		// Check if both values are integers.
		if (Number.isFinite(leftValue) && Number.isFinite(rightValue)) {
			// When both values are equal, continue to the next values in
			// the packets.
			if (leftValue === rightValue) {
				continue;
			}

			// When the left value is smaller than the right value the packets
			// are considered to be in the right order.
			return leftValue < rightValue;
		}

		// At least one of the two values is an array. Call compareLists again
		// but this time with the sub lists after converting the integer value
		// to a list.
		const compareResult = compareLists(
			convertToArray(leftValue),
			convertToArray(rightValue)
		);
		// When the lists are identical, continue with the next values.
		if (compareResult !== undefined) {
			return compareResult;
		}
	}

	// Both lists are identical.
	return undefined;
}
