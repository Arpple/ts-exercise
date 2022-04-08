export function readInt(input: string): string {
	return input
		.split('')
		.reverse()
		.reduce((numbers: string[], char) => {
			return numbers.includes(char)
				? numbers
				: [...numbers, char]
		}, [] as string[])
		.join('')
}
