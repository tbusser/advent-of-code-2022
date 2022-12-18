type Content = 'Abyss' | 'Air' | 'Rock' | 'Sand';

type Grid = Record<number, Record<number, Tile>>;

interface Position {
	x: number;
	y: number;
}

type RawRange = `${string},${string}`;
type RockPath = `${RawRange} -> ${RawRange}`;

interface Tile extends Position {
	content: Content;
}

/* ========================================================================== */

const source: Position = {
	x: 500,
	y: 0
};

/* ========================================================================== */

/**
 * Constructs a single tile with the specified content.
 */
function constructTile(x: number, y: number, content: Content): Tile {
	return {
		content,
		x,
		y
	};
}

/**
 * Creates rock tiles for a given rang. The start and end position must either
 * be in the same row or same column.
 */
function createRockTiles(start: RawRange, end: RawRange): Tile[] {
	// Breakup the start and end range into their column and row parts.
	const startPoint = start.split(',').map(value => parseInt(value, 10));
	const endPoint = end.split(',').map(value => parseInt(value, 10));

	// Get the modifiers to get from the start to the end position.
	const columnModifier = getColumnModifier(startPoint, endPoint);
	const rowModifier = getRowModifier(startPoint, endPoint);
	// Set the initial position.
	const position: Position = { x: startPoint[0], y: startPoint[1] };

	const result = [];

	// Keep constructing tiles until the end position has been reached. Push
	// each created tile in the result array.
	do {
		result.push(constructTile(position.x, position.y, 'Rock'));
		// Move the next position.
		position.x += columnModifier;
		position.y += rowModifier;
	} while (!(position.x === endPoint[0] && position.y === endPoint[1]));
	// The end position has been reached but this hasn't yet been pushed into
	// the result array. Add the tile for the end position to the result.
	result.push(constructTile(position.x, position.y, 'Rock'));

	return result;
}

function getColumnModifier(
	[startColumn]: number[],
	[endColumn]: number[]
): number {
	if (startColumn === endColumn) {
		return 0;
	}

	return startColumn > endColumn ? -1 : 1;
}

function getRowModifier([, startRow]: number[], [, endRow]: number[]): number {
	if (startRow === endRow) {
		return 0;
	}

	return startRow > endRow ? -1 : 1;
}

export class Cave {
	constructor(input: string) {
		this.constructCave(input);
	}

	/* ---------------------------------------------------------------------- */

	private grid: Grid = {};
	private hasFloor = false;
	private maxRow = -Infinity;
	private maxColumn = -Infinity;
	private minColumn = Infinity;

	/* ---------------------------------------------------------------------- */

	/**
	 * Adds a tile to the cave but only when no tile has been added at the same
	 * position in the grid.
	 */
	private addTile(tile: Tile, overwrite = false): void {
		if (this.grid[tile.y]?.[tile.x] !== undefined && !overwrite) {
			return;
		}

		this.grid[tile.y] ||= {};
		this.grid[tile.y][tile.x] = tile;
	}

	/**
	 * Takes the puzzle input and constructs the interior of the cave. For all
	 * the rock paths it will have added rocks to the cave grid.
	 */
	private constructCave(input: string): void {
		// Split the input into separate rock paths. For each path the tiles
		// which contain rock need to be created.
		const rockPaths = input.split('\n');

		rockPaths.forEach((rockPath: RockPath) => {
			// Split the path up into its coordinates where a line starts/ends.
			const coordinates = rockPath.split(' -> ') as RawRange[];
			// Get the first coordinate, this is the start of the rock path.
			let previousCoordinate = coordinates[0];
			// Iterate over all the coordinates in the rock path but skip the
			// first coordinate as that is already the starting point.
			for (let index = 1; index < coordinates.length; index++) {
				// Create the rock tiles for the path and add each individual
				// rock to the cave grid.
				createRockTiles(previousCoordinate, coordinates[index]).forEach(rock => {
					this.addTile(rock);
					// Keep track of the boundaries of the grid. To evaluate
					// when a grain of sand falls into the abyss it is needed
					// to know where the first and last column with a rock is
					// and on which row the last rock is located.
					this.updateBoundaries(rock);
				});
				// Make the current coordinate the previous coordinate so it
				// will serve as the start coordinate for the next part of the
				// rock path.
				previousCoordinate = coordinates[index];
			}
		});
	}

	/**
	 * Determines the next available tile for a grain of sand.
	 *
	 * @returns The result is the next tile which is empty, either containing
	 *          air or the abyss. When there is no empty tile below the current
	 *          position the result is undefined signaling the grain of sand has
	 *          come to rest.
	 */
	private getNextTilePosition(tile: Position): Tile | undefined {
		function isAvailable({ content }: Tile): boolean {
			return content === 'Abyss' || content === 'Air';
		}

		// Get the tile immediately below the current tile and return it when it
		// is available for a grain of sand to occupy it.
		const tileBelow = this.getTileAtPosition({ x: tile.x, y: tile.y + 1 });
		if (isAvailable(tileBelow)) {
			return tileBelow;
		}

		// The tile immediately below the current tile is unavailable, check if
		// the tile below and to the left is still free. Return this tile when
		// it can still hold a grain of sand.
		const tileLeft = this.getTileAtPosition({ x: tile.x - 1, y: tile.y + 1 });
		if (isAvailable(tileLeft)) {
			return tileLeft;
		}

		// The tile immediately below and to the left of the current tile is
		// unavailable, check if the tile below and to the right is still free.
		// Return this tile when it can still hold a grain of sand.
		const tileRight = this.getTileAtPosition({ x: tile.x + 1, y: tile.y + 1 });
		if (isAvailable(tileRight)) {
			return tileRight;
		}

		// None of the positions can hold the grain of sand, the grain of sand
		// has come to rest.
		return undefined;
	}

	/**
	 * Returns the default content value for a specific position.
	 */
	private getDefaultContentValue(position: Position): Content {
		// Make sure the position is within the cave.
		const isValid = this.isValidPosition(position);

		// When the position is valid and the cave has a floor it is necessary
		// to check of the position is on the floor line. In this case the
		// default will be rock.
		if (isValid && this.hasFloor && position.y === this.maxRow) {
			return 'Rock';
		}

		// Inside the cave the default value is air, outside the cave it will
		// default to abyss.
		return isValid ? 'Air' : 'Abyss';
	}

	private getTileAtPosition(position: Position): Tile {
		// Determine the default content for the position. For valid positions
		// we default to air, invalid positions are part of the abyss.
		const tileContent: Content = this.getDefaultContentValue(position);
		// Add the tile with the default content. If there is already a tile
		// present at the position it will NOT be overwritten by this default
		// content tile.
		this.addTile(constructTile(position.x, position.y, tileContent));

		// Return the tile at the requested position.
		return this.grid[position.y][position.x];
	}

	private isValidPosition({ x, y }: Position): boolean {
		// When the position falls outside of the min and max column it is
		// considered to be invalid.
		if (x < this.minColumn || x > this.maxColumn) {
			return false;
		}

		// When the position falls outside of the min and max row it is
		// considered to be invalid.
		if (y < 0 || y > this.maxRow) {
			return false;
		}

		return true;
	}

	private updateBoundaries(tile: Tile): void {
		if (tile.y > this.maxRow) {
			this.maxRow = tile.y;
		}
		if (tile.x < this.minColumn) {
			this.minColumn = tile.x;
		}
		if (tile.x > this.maxColumn) {
			this.maxColumn = tile.x;
		}
	}

	/* ---------------------------------------------------------------------- */

	/**
	 * Adds floor to the cave. When the cave has a floor it means its width is
	 * infinity. The floor of the cave will always be 2 rows below the lowest
	 * rock path.
	 */
	public addFloor() {
		// Set the flag to indicate the cave has a floor.
		this.hasFloor = true;
		// Make the width of the cave infinite.
		this.maxColumn = Infinity;
		this.minColumn = -Infinity;
		// Add two rows to the cave, this will be the row where the cave
		// floor is.
		this.maxRow += 2;
	}

	public dropGrain(): boolean {
		let lastTile: Tile;
		let tile: Tile = this.getTileAtPosition(source);
		do {
			lastTile = tile;
			tile = this.getNextTilePosition(tile);
		} while (tile !== undefined && tile.content !== 'Abyss');

		// When tile is undefined it means the grain of sand has come to rest.
		// The grain is only truly at rest when the last tile doesn't contain
		// sand. When the last tile does it contain sand it means the cave has
		// filled up to max capacity.
		if (tile === undefined && lastTile.content !== 'Sand') {
			// The tile and the position will become a tile with sand as its
			// content. Use the overwrite flag so any previous content it may
			// have will be overwritten.
			this.addTile(constructTile(lastTile.x, lastTile.y, 'Sand'), true);

			return true;
		}

		return false;
	}
}
