export interface Position {
	x: number;
	y: number;
}

export interface Coordinate extends Position {
	height: number;
	id: string;
}

const startSymbol = 'S';
const endSymbol = 'E';

const relativeNeighbors: Position[] = [
	{ x: 0, y: -1 },
	{ x: 0, y: 1 },
	{ x: 1, y: 0 },
	{ x: -1, y: 0 }
];

/* ========================================================================== */

export class Grid {
	constructor(input: string) {
		this.createGrid(input);
	}

	/* ---------------------------------------------------------------------- */

	public grid: Array<Coordinate[]>;

	public startPosition: Coordinate;
	public endPosition: Coordinate;

	/* ---------------------------------------------------------------------- */

	private createGrid(input: string): void {
		const rows = input.split('\n');

		this.grid = rows.map((row, rowIndex) => {
			const columns: string[] = row.split('');

			return columns.map((column, columnIndex) => {
				if (column === startSymbol) {
					this.startPosition = {
						height: 1,
						id: this.serializePosition(columnIndex, rowIndex),
						x: columnIndex,
						y: rowIndex
					};

					return this.startPosition;
				} else if (column === endSymbol) {
					this.endPosition = {
						height: 26,
						id: this.serializePosition(columnIndex, rowIndex),
						x: columnIndex,
						y: rowIndex
					};

					return this.endPosition;
				}

				return {
					height: column.charCodeAt(0) - 96,
					id: this.serializePosition(columnIndex, rowIndex),
					x: columnIndex,
					y: rowIndex
				};
			});
		});
	}

	private getCoordinateAtPosition(position: Position): Coordinate | undefined {
		if (!this.isValidPosition(position)) {
			return undefined;
		}

		return this.grid[position.y][position.x];
	}

	private isValidPosition({ x, y }: Position): boolean {
		return y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[0].length;
	}

	private serializePosition(x: number, y: number): string {
		return `${x},${y}`;
	}

	/* ---------------------------------------------------------------------- */

	public getViableNeighbors(
		position: Position,
		predicate: (neighborHeight: number, positionHeight: number) => boolean
	): Coordinate[] {
		const coordinate = this.getCoordinateAtPosition(position);

		return relativeNeighbors.reduce(
			(neighbors: Coordinate[], relativePosition) => {
				const neighborPosition = {
					x: position.x + relativePosition.x,
					y: position.y + relativePosition.y
				};
				const neighborCoordinate = this.getCoordinateAtPosition(neighborPosition);
				if (
					neighborCoordinate !== undefined &&
					predicate(neighborCoordinate.height, coordinate.height)
				) {
					neighbors.push(neighborCoordinate);
				}

				return neighbors;
			},
			[]
		);
	}

	public isEndPosition({ x, y }: Position): boolean {
		return x === this.endPosition.x && y === this.endPosition.y;
	}

	public isStartCoordinate({ height }: Coordinate): boolean {
		return height === 1;
	}
}
