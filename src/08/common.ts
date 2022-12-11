export type Direction = 'bottom' | 'left' | 'right' | 'top';

export interface Tree {
	bottom?: number;
	height: number;
	left?: number;
	isVisible?: boolean;
	right?: number;
	top?: number;
}

export interface Position {
	column: number;
	row: number;
}

/* ========================================================================== */

export const directions: Direction[] = ['top', 'bottom', 'right', 'left'];

/* ========================================================================== */

/**
 * Creates a single Tree object. It will set the height of the tree.
 */
function createTree(height: string): Tree {
	return {
		height: parseInt(height, 10)
	};
}

function getColumnModifierForDirection(direction: Direction): number {
	if (direction === 'top' || direction === 'bottom') {
		return 0;
	}

	return direction === 'left' ? -1 : 1;
}

function getRowModifierForDirection(direction: Direction): number {
	if (direction === 'left' || direction === 'right') {
		return 0;
	}

	return direction === 'top' ? -1 : 1;
}

/* ========================================================================== */

/**
 * Converts a line from the input into an array of Tree objects.
 */
export function createRowOfTrees(row: string): Tree[] {
	// Split the row into individual trees.
	return row.split('').map(createTree);
}

/**
 * Returns the tree at the request position. When the position is invalid the
 * result will be undefined.
 */
export function getTreeAtPosition(
	grid: Tree[][],
	position: Position
): Tree | undefined {
	return grid[position.row]?.[position.column];
}

export function* traverseGrid(
	grid: Tree[][],
	position: Position,
	direction: Direction
) {
	// Get the column and row modifiers, these will be used to go from one tree
	// to the next in the requested direction.
	const rowModifier = getRowModifierForDirection(direction);
	const columnModifier = getColumnModifierForDirection(direction);

	// Initialize the current position.
	let currentPosition = {
		column: position.column,
		row: position.row
	};
	let tree: Tree;

	// Keep walking through the grid until we've moved outside of the grid. This
	// will have happened when tree becomes undefined.
	do {
		// Modify the position so we move one tree in the
		// specified direction.
		currentPosition = {
			column: currentPosition.column + columnModifier,
			row: currentPosition.row + rowModifier
		};
		// Get the tree at the new location.
		tree = getTreeAtPosition(grid, currentPosition);
		// If there is a tree at the location, yield it.
		if (tree) {
			yield tree;
		}
	} while (tree !== undefined);
}
