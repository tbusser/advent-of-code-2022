import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

/* ========================================================================== */

type InputValue = 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z';

/* ========================================================================== */

enum Hand {
	Rock = 1,
	Paper,
	Scissors
}

const handMapping: Record<InputValue, Hand> = {
	A: Hand.Rock,
	B: Hand.Paper,
	C: Hand.Scissors,
	X: Hand.Rock,
	Y: Hand.Paper,
	Z: Hand.Scissors
};

/* ========================================================================== */

function convertInputToNumber(input: InputValue): Hand {
	return handMapping[input];
}

function getGameResult(opponent: Hand, mine: Hand): number {
	const myCorrectedHand = opponent === Hand.Rock ? mine % 3 : mine;

	if (opponent === myCorrectedHand) {
		return 3;
	}

	const opponentWins = opponent - myCorrectedHand === 1;

	return opponentWins ? 0 : 6;
}

async function findSolution(input: string): Promise<number> {
	// Split the input per line, once that is done split each line on the space
	// between the two characters. This will result in an array of
	// string arrays.
	const games: InputValue[][] = input
		.split('\n')
		.map(item => item.split(' ') as InputValue[]);

	return games.reduce((total, game) => total + scoreGame(game), 0);
}

function scoreGame(game: InputValue[]): number {
	const opponent = convertInputToNumber(game[0]);
	const mine = convertInputToNumber(game[1]);

	return mine + getGameResult(opponent, mine);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(2);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Total score: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
