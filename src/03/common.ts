const ASCII_LOWERCASE_A = 97;
// Lowercase letters start at 97. The lowercase a corresponds with priority 1
// so to go from ASCII to priority we need to subtract 96 from the ASCII code.
const LOWERCASE_MODIFIER = 96;
// Uppercase letters start at 65. The uppercase A corresponds with priority 27
// so to go from ASCII to priority we need to subtract 38 from the ASCII code.
const UPPERCASE_MODIFIER = 38;

/* ========================================================================== */

/**
 * Determines the priority for the given item.
 */
export function convertItemToPriority(item: string): number {
	const charCode: number = item.charCodeAt(0);

	return charCode < ASCII_LOWERCASE_A
		? charCode - UPPERCASE_MODIFIER
		: charCode - LOWERCASE_MODIFIER;
}
