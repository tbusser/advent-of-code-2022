import { buildConfig, Config } from './common.js';

/* ========================================================================== */

export class Monkey {
	constructor(private config: Config) {
		this.items = config.startingItems;
	}

	/* ---------------------------------------------------------------------- */

	private items: number[] = [];
	private inspections = 0;

	public get inspectedItemCount(): number {
		return this.inspections;
	}

	public get testingNumber(): number {
		return this.config.test.divisibleBy;
	}

	/* ---------------------------------------------------------------------- */

	static createMonkey(config: string): Monkey {
		const parsedConfig = buildConfig(config);

		return new Monkey(parsedConfig);
	}

	/* ---------------------------------------------------------------------- */

	private calculateWorryLevel(item: number): number {
		const a =
			this.config.operation.operandA === 'old'
				? item
				: this.config.operation.operandA;
		const b =
			this.config.operation.operandB === 'old'
				? item
				: this.config.operation.operandB;

		return this.config.operation.operation === 'plus' ? a + b : a * b;
	}

	/* ---------------------------------------------------------------------- */

	public *inspectItems(denominator?: number) {
		while (this.items.length > 0) {
			this.inspections++;

			// Get the worry level of the first item and calculate what the
			// worry level will be after inspection.
			const worryLevel = this.items.shift();
			const worryLevelAfterInspection = this.calculateWorryLevel(worryLevel);

			// When no denominator is specified the worried level decreases by
			// dividing it by 3. When a denominator is specified a modulo
			// operation is needed to keep the worry levels from getting to
			// large to handle. The modulo keeps the numbers within a manageable
			// range without affecting the test.
			const testLevel =
				denominator === undefined
					? Math.floor(worryLevelAfterInspection / 3)
					: worryLevelAfterInspection % denominator;

			const passesTest = testLevel % this.config.test.divisibleBy === 0;
			const destination = passesTest
				? this.config.test.passDestination
				: this.config.test.failDestination;

			yield {
				item: testLevel,
				destination
			};
		}
	}

	/**
	 * Adds an item at the end of the list.
	 */
	public addItem(item: number): void {
		this.items.push(item);
	}
}
