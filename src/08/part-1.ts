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

function isTreeVisible(grid: Tree[][], position: Position): boolean {
	// When the tree is at the edge it is always visible.
	if (isPositionAtEdge(grid, position)) {
		return true;
	}

	// When the tree is inside the forest, check for each of the four directions
	// if the tree can be seen from outside. As soon as the tree is determined
	// to be visible, stop checking the other direction.
	return directions.some(direction =>
		isVisibleFromDirection(grid, position, direction)
	);
}

/**
 * Checks if the tree at the specified position is visible from the
 * specified direction.
 */
function isVisibleFromDirection(
	grid: Tree[][],
	position: Position,
	direction: Direction
): boolean {
	// Get tree at the initial position.
	const startingTree = getTreeAtPosition(grid, position);
	// Get the height of the tree whose visibility needs to get checked.
	const { height } = startingTree;
	// Create a tree walker which will move from the initial position in the
	// specified direction.
	const treeWalker = traverseGrid(grid, position, direction);

	// Iterate over all the trees in the specified direction.
	for (const tree of treeWalker) {
		// When the current tree is not visible, check if the tree that blocked
		// it would also block the starting tree. If this is not case check if
		// the current tree is high enough to block the starting tree.
		if ((!tree.isVisible && tree[direction] >= height) || tree.height >= height) {
			// Keep a record of how high the tree was that blocked visibility
			// for the direction specified.
			startingTree[direction] = tree.height;

			// The tree is not visible.
			return false;
		}
	}

	// There is no tree blocking the view, the tree is visible
	return true;
}

async function findSolution(input: string): Promise<number> {
	// Each row of trees is separated by a new line.
	const rows = input.split('\n');
	// Create a grid of tree objects. Each item in the array represents a row
	// of trees. The row is another array where each item represents a column.
	const grid: Tree[][] = rows.map(createRowOfTrees);

	// Initialize the counter to keep track of the number of visible trees.
	let numberOfVisibleTrees = 0;
	// Iterate over all the rows of trees.
	grid.forEach((row, rowIndex) =>
		// Iterate over all the trees in the row.
		row.forEach((tree, columnIndex) => {
			// Check if the tree is visible from outside the forest.
			tree.isVisible = isTreeVisible(grid, { column: columnIndex, row: rowIndex });
			// When the tree is visible increase the counter to keep track of
			// the number of visible trees.
			if (tree.isVisible) {
				numberOfVisibleTrees++;
			}
		})
	);

	// Return the number of visible trees.
	return numberOfVisibleTrees;
}

/* ========================================================================== */

// Get the input for the puzzle.
const rawInput: string = await fetchInputForDay(8);
const result = await measure<number>(() => findSolution(rawInput));

/* -------------------------------------------------------------------------- */

console.log(`Number of visible trees: ${result.answer}`);
console.log(`Time taken: ${result.duration}ms`);
