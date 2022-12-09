import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

/* ========================================================================== */

enum Hand {
	Rock = 1,
	Paper,
	Scissors
}

enum Resolution {
	Lose = 0,
	Draw = 3,
	Win = 6
}

const handMapping = {
	A: Hand.Rock,
	B: Hand.Paper,
	C: Hand.Scissors
};

const resolutionMapping = {
	X: Resolution.Lose,
	Y: Resolution.Draw,
	Z: Resolution.Win
};

/* ========================================================================== */

function convertInputToHand(playedValue: string): Hand {
	return handMapping[playedValue];
}

function convertInputToResolution(value: string): Resolution {
	return resolutionMapping[value];
}

async function findSolution(input: string): Promise<number> {
	// Split the input per line, once that is done split each line on the space
	// between the two characters. This will result in an array of
	// string arrays.
	const games = input.split('\n').map(item => item.split(' '));

	return games.reduce((total, game) => total + scoreGame(game), 0);
}

function getMove(opponent: Hand, resolution: Resolution): Hand {
	if (resolution === Resolution.Draw) {
		return opponent;
	}

	const result = opponent + (resolution === Resolution.Lose ? -1 : 1);

	if (result < 1) {
		return 3;
	} else if (result > 3) {
		return 1;
	} else {
		return result;
	}
}

function scoreGame(game: string[]): number {
	const opponent = convertInputToHand(game[0]);
	const resolution = convertInputToResolution(game[1]);
	const myMove = getMove(opponent, resolution);

	return myMove + resolution;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(2);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
