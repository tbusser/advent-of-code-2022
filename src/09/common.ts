import { Direction, Knot } from './Knot.js';

/* ========================================================================== */

export interface Move {
	direction: Direction;
	steps: number;
}

/* ========================================================================== */

export function createKnots(numberOfKnots: number): Knot[] {
	return new Array(numberOfKnots)
		.fill(null)
		.map((value, index) => new Knot(index === numberOfKnots - 1));
}

export function createMove(input: string): Move {
	const [direction, steps] = input.split(' ');

	return {
		direction: direction as Direction,
		steps: parseInt(steps, 10)
	};
}

export function executeMove(move: Move, knots: Knot[]): void {
	// Perform the number of steps as specified in the move.
	for (let step = 0; step < move.steps; step++) {
		// Move the head in the specified direction.
		knots[0].move(move.direction);

		// Init the previous knot to the head.
		let previousKnot = knots[0];
		// Iterate over the knots which come after the head.
		for (let knotIndex = 1; knotIndex < knots.length; knotIndex++) {
			// Follow the knot before it.
			knots[knotIndex].follow(previousKnot);
			// Update the previous knot so the next iteration will follow the
			// current knot.
			previousKnot = knots[knotIndex];
		}
	}
}
