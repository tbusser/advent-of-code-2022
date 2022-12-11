import { fetchInputForDay } from '../utils/fetch-input.js';
import { measure } from '../utils/performance.js';

import {
	createRowOfTrees,
	Direction,
	directions,
	getTreeAtPosition,
	Position,
	traverseGrid,
	Tree
} from './common.js';

/* ========================================================================== */

/**
 * Checks if the provided position is at the edge of the grid.
 */
function isPositionAtEdge(grid: Tree[][], position: Position): boolean {
	return (
		position.column === 0 ||
		position.row === 0 ||
		position.column === grid[0].length - 1 ||
		position.row === grid.length - 1
	);
}

function getTreeScenicScore(grid: Tree[][], position: Position): number {
	// When the tree is at the edge it is will always have one side with a
	// viewing distance of 0. This means trees at the edge will always have a
	// total score of 0.
	if (isPositionAtEdge(grid, position)) {
		return 0;
	}

	// When the tree is inside the forest, check for each of the four directions
	// what the viewing distance is. The score is the multiplication of the
	// viewing distances in all four directions.
	return directions.reduce(
		(total, direction) =>
			total * determineViewingDistanceInDirection(grid, position, direction),
		1
	);
}

/**
 * Checks the viewing the distance from the specified position in the forest in
 * one of the four directions.
 */
function determineViewingDistanceInDirection(
	grid: Tree[][],
	position: Position,
	direction: Direction
): number {
	// Get tree at the initial position.
	const startingTree = getTreeAtPosition(grid, position);
	// Get the height of the tree whose viewing distance needs to get checked.
	const { height } = startingTree;
	// Create a tree walker which will move from the initial position in the
	// specified direction.
	const treeWalker = traverseGrid(grid, position, direction);
	// Initialize the viewing distance.
	let viewingDistance = 0;

	// Iterate over all the trees in the specified direction.
	for (const tree of treeWalker) {
		// Increase the number of visible trees from the starting tree.
		viewingDistance++;
		// When the current tree is higher than the starting tree, the end of
		// the viewing distance has been reached.
		if (tree.height >= height) {
			// Return the viewing distance.
			return viewingDistance;
		}
	}

	// All the trees in the specified direction have been checked, return the
	// viewing distance.
	return viewingDistance;
}

async function findSolution(input: string): Promise<number> {
	// Each row of trees is separated by a new line.
	const rows = input.split('\n');
	// Create a grid of tree objects. Each item in the array represents a row
	// of trees. The row is another array where each item represents a column.
	const grid: Tree[][] = rows.map(createRowOfTrees);

	// Initialize the counter to keep track of the number of visible trees.
	let highestScenicScore = 0;
	// Iterate over all the rows of trees.
	grid.forEach((row, rowIndex) =>
		// Iterate over all the trees in the row.
		row.forEach((tree, columnIndex) => {
			// Get the scenic score for the current position.
			const score = getTreeScenicScore(grid, {
				column: columnIndex,
				row: rowIndex
			});

			// Save the score if it is the highest score so far.
			if (score > highestScenicScore) {
				highestScenicScore = score;
			}
		})
	);

	// Return the highest scenic score.
	return highestScenicScore;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(8);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Highest scenic score: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
