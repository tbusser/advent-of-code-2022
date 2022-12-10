import { RegExpGroups } from '../utils/types.js';

import { Directory } from './Directory.js';

/* ========================================================================== */

type ChangeFolderResult = RegExpGroups<'folder'>;

/* ========================================================================== */

const COMMAND_PREFIX = '$';
const DIRECTORY_PREFIX = 'dir';
const LIST_COMMAND = `${COMMAND_PREFIX} ls`;

const regexChangeFolder = /\$ cd (?<folder>\S+)$/;

/* ========================================================================== */

function addDirectory(line: string, directory: Directory): void {
	// A directory line consists of the dir prefix and the name of the directory
	// separated by a space. Split the line and keep the second item.
	const [, name] = line.split(' ');
	directory.addDirectory(name);
}

function addFile(line: string, directory: Directory): void {
	// A file line consists of the file size and file name separated by a space.
	const [size, name] = line.split(' ');
	directory.addFile(name, parseInt(size, 10));
}

function isCommand(line: string): boolean {
	return line.startsWith(COMMAND_PREFIX);
}

function isDirectory(line: string): boolean {
	return line.startsWith(DIRECTORY_PREFIX);
}

function performCommand(
	line: string,
	currentDirectory: Directory,
	root: Directory
): Directory {
	if (line === LIST_COMMAND) {
		return currentDirectory;
	}

	const folderName = (regexChangeFolder.exec(line) as ChangeFolderResult)?.groups
		?.folder;
	switch (folderName) {
		case undefined:
			return currentDirectory;

		case '/':
			return root;

		case '..':
			return currentDirectory.parent;

		default:
			return currentDirectory.getDirectory(folderName);
	}
}

/* ========================================================================== */

export function recreateFileSystem(terminalOutput: string[]): Directory {
	const root = new Directory('/');

	let currentDirectory: Directory | null = null;

	terminalOutput.forEach(line => {
		if (isCommand(line)) {
			currentDirectory = performCommand(line, currentDirectory, root);
		} else if (isDirectory(line)) {
			addDirectory(line, currentDirectory);
		} else {
			addFile(line, currentDirectory);
		}
	});

	return root;
}
