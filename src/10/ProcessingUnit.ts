const NOOP_INSTRUCTION = 'noop';

const buffer: Array<number | null> = [];
let cycle = 0;

/* ========================================================================== */

function bufferInstruction(instruction: string): void {
	// Always push a null. The NOOP is just a null and an addx instruction
	// always requires 1 NOOP as well.
	buffer.push(null);

	if (instruction === NOOP_INSTRUCTION) {
		return;
	}

	const [, value] = instruction.split(' ');
	buffer.push(parseInt(value, 10));
}

/* ========================================================================== */

export function getCycleId(): number {
	return cycle;
}

export function* executeInstructions() {
	let register = 1;

	cycle = 0;

	do {
		cycle++;

		// Return the value of the register during the current cycle.
		yield {
			/**
			 * The ID of the cycle. The first cycle starts at 1 instead of the
			 * usual value of 0.
			 */
			cycle,
			/**
			 * The value of the register during the active cycle.
			 */
			value: register
		};

		// Get the next instruction from the buffer. Since the instructions were
		// pushed in the buffer the instruction we need is at index 0.
		const value = buffer.shift();

		// When the instruction is not a NOOP, add the value to the current
		// register value.
		if (value !== null) {
			register += value;
		}
	} while (buffer.length > 0);
}

export function loadInstructions(instructions: string[]): void {
	instructions.forEach(bufferInstruction);
}
