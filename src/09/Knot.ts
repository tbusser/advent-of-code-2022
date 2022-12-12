export enum Direction {
	Down = 'D',
	Left = 'L',
	Right = 'R',
	Up = 'U'
}

interface Position {
	x: number;
	y: number;
}

interface RelativePosition {
	diagonal: boolean;
	down: number;
	left: number;
	right: number;
	up: number;
}

/* ========================================================================== */

export class Knot {
	constructor(readonly trackPositions = false) {
		this.recordPosition();
	}

	/* ---------------------------------------------------------------------- */

	private uniquePositions = new Set<string>();
	private x = 0;
	private y = 0;

	public get currentPosition(): Position {
		return {
			x: this.x,
			y: this.y
		};
	}

	public get numberOfVisitedUniquePositions(): number {
		return this.uniquePositions.size;
	}

	/* ---------------------------------------------------------------------- */

	private recordPosition(): void {
		if (!this.trackPositions) {
			return;
		}

		this.uniquePositions.add(this.serializePosition());
	}

	private serializePosition(): string {
		return `${this.x},${this.y}`;
	}

	/* ---------------------------------------------------------------------- */

	/**
	 * Calculates the distance between the knot and another knot. It gives the
	 * distance per direction.
	 */
	public calculateRelativeDistance(knot: Knot): RelativePosition {
		const otherPosition = knot.currentPosition;

		// Calculate the distance for all four directions. A direction can never
		// be a negative number.
		const down = otherPosition.y < this.y ? this.y - otherPosition.y : 0;
		const left = otherPosition.x < this.x ? this.x - otherPosition.x : 0;
		const right = otherPosition.x > this.x ? otherPosition.x - this.x : 0;
		const up = otherPosition.y > this.y ? otherPosition.y - this.y : 0;

		const distances = [down, left, right, up];
		// The distance is diagonal when in one direction the distance is 2
		// positions and in the other direction it is 1 position.
		const diagonal =
			distances.some(value => value === 2) && distances.some(value => value === 1);

		return {
			diagonal,
			down,
			left,
			right,
			up
		};
	}

	/**
	 * Updates the location of the knot to ensure it is never more then 1
	 * position away from the provided knot.
	 */
	public follow(knot: Knot): void {
		const { diagonal, down, left, right, up } =
			this.calculateRelativeDistance(knot);

		/**
		 * The knot should follow in the direction when the distance is 2 or
		 * when the distance is 1 and the two knots for a diagonal line.
		 */
		function shouldFollow(distance: number): boolean {
			return distance === 2 || (distance === 1 && diagonal);
		}

		if (shouldFollow(down)) {
			this.y -= 1;
		}
		if (shouldFollow(left)) {
			this.x -= 1;
		}
		if (shouldFollow(right)) {
			this.x += 1;
		}
		if (shouldFollow(up)) {
			this.y += 1;
		}

		this.recordPosition();
	}

	/**
	 * Moves the knot 1 position in the specified direction.
	 */
	public move(direction: Direction): void {
		switch (direction) {
			case Direction.Down:
				this.y -= 1;
				break;

			case Direction.Left:
				this.x -= 1;
				break;

			case Direction.Right:
				this.x += 1;
				break;

			case Direction.Up:
				this.y += 1;
				break;
		}

		// Record the new position of the knot.
		this.recordPosition();
	}
}
