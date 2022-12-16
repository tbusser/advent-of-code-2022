import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import { Coordinate, Grid } from './Grid.js';

/* ========================================================================== */

interface QueueItem {
	depth: number;
	coordinate: Coordinate;
}

/* ========================================================================== */

function neighborPredicate(
	neighborHeight: number,
	currentHeight: number
): boolean {
	// We're going from low to heigh. In order for the neighbor to be a valid
	// next step it should not be more than 1 higher then the current height.
	return neighborHeight <= currentHeight + 1;
}

function solve(grid: Grid, start: Coordinate): number {
	const priorityQueue: QueueItem[] = [
		{
			depth: 0,
			coordinate: start
		}
	];
	const visitedPositions = new Set<string>([start.id]);

	// Keep processing the queue until it is empty.
	while (priorityQueue.length > 0) {
		// Get the top item from the queue.
		const { coordinate, depth } = priorityQueue.pop();
		// When the current item is the end position, return how many steps it
		// took to get there.
		if (grid.isEndPosition(coordinate)) {
			return depth;
		}

		// Get the neighbors for the current cell which we can go to.
		const neighbors = grid.getViableNeighbors(coordinate, neighborPredicate);
		// Iterate over all the neighbors.
		neighbors.forEach(neighbor => {
			// When the position is already in the set of visited positions,
			// skip processing it.
			if (visitedPositions.has(neighbor.id)) {
				return;
			}

			// Add the position to the set of visited positions, that will keep
			// us from going to this position more than once in case it's a
			// neighbor to multiple cells.
			visitedPositions.add(neighbor.id);
			// Add the position to the queue, increase the depth by 1 as we had
			// to take an extra step to reach this position.
			priorityQueue.unshift({
				depth: depth + 1,
				coordinate: neighbor
			});
		});
	}

	// When the while loop hasn't returned any value it means there is no
	// solution available for the grid.
	return -1;
}

async function findSolution(input: string): Promise<number> {
	const grid = new Grid(input);

	return solve(grid, grid.startPosition);
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(12);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Number of steps in shortest path: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
