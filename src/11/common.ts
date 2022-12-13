import { RegExpGroups } from '../utils/types.js';

/* ========================================================================== */

type Operand = number | 'old';
type Operation = 'plus' | 'times';

export interface Config {
	startingItems: number[];
	operation: OperationConfig;
	test: TestConfig;
}

interface OperationConfig {
	operandA: Operand;
	operandB: Operand;
	operation: Operation;
}

interface TestConfig {
	divisibleBy: number;
	failDestination: number;
	passDestination: number;
}

type OperationConfigResult = RegExpGroups<
	'operandA' | 'operandB' | 'operation'
>;

/* ========================================================================== */

enum ConfigLines {
	Identifier,
	StartingItems,
	Operation,
	Test,
	PassResult,
	FailResult
}

const operationConfigRegex =
	/.+=\s(?<operandA>.+?)\s(?<operation>.)\s(?<operandB>.+)/;

/* ========================================================================== */

function getOperandValue(input: string): Operand {
	const value = parseInt(input, 10);

	return isNaN(value) ? 'old' : value;
}

function getOperation(input: string): Operation {
	return input === '+' ? 'plus' : 'times';
}

function parseOperation(line: string): OperationConfig {
	const regexResult: OperationConfigResult = operationConfigRegex.exec(line);

	return {
		operandA: getOperandValue(regexResult.groups.operandA),
		operandB: getOperandValue(regexResult.groups.operandB),
		operation: getOperation(regexResult.groups.operation)
	};
}

function parseStartingItems(line: string): number[] {
	// Get the part of the string after the label, these are the starting items.
	const [, items] = line.split(': ');

	// Split the string into the individual items and convert the items
	// to numbers.
	return items.split(', ').map(item => parseInt(item, 10));
}

function parseTest(
	conditionLine: string,
	passLine: string,
	failLine: string
): TestConfig {
	const regexNumber = /\d+/;

	return {
		divisibleBy: parseInt(conditionLine.match(regexNumber)[0], 10),
		failDestination: parseInt(failLine.match(regexNumber)[0], 10),
		passDestination: parseInt(passLine.match(regexNumber)[0], 10)
	};
}

/* ========================================================================== */

export function buildConfig(input: string): Config {
	const lines = input.split('\n');

	return {
		startingItems: parseStartingItems(lines[ConfigLines.StartingItems]),
		operation: parseOperation(lines[ConfigLines.Operation]),
		test: parseTest(
			lines[ConfigLines.Test],
			lines[ConfigLines.PassResult],
			lines[ConfigLines.FailResult]
		)
	};
}

export function calculateMonkeyBusiness(counts: number[]): number {
	// Order the array from highest to lowest count.
	counts.sort((a, b) => b - a);

	// Multiply the two highest scores and return the result.
	return counts[0] * counts[1];
}
