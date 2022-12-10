interface File {
	name: string;
	size: number;
}

/* ========================================================================== */

export class Directory {
	constructor(readonly name: string, readonly parent?: Directory) {
		//
	}

	/* ---------------------------------------------------------------------- */

	public directories: Map<string, Directory> = new Map();
	private files: File[] = [];

	private directSize = 0;

	/* ---------------------------------------------------------------------- */

	addFile(name: string, size: number): void {
		this.files.push({
			name,
			size
		});

		this.directSize += size;
	}

	addDirectory(name: string): void {
		this.directories.set(name, new Directory(name, this));
	}

	getDirectory(name: string): Directory | undefined {
		return this.directories.get(name);
	}

	getSize(): number {
		const indirectSize = Array.from(this.directories).reduce(
			(total, [, directory]) => total + directory.getSize(),
			0
		);

		return this.directSize + indirectSize;
	}

	print(level = 0): void {
		const padding = new Array(level * 2).fill('  ').join('');
		console.log(`${padding}- ${this.name} (dir, size=${this.getSize()})`);

		this.directories.forEach(directory => directory.print(level + 1));
		this.files.forEach(file =>
			console.log(`${padding}|  - ${file.name} (file, size=${file.size})`)
		);
	}
}
