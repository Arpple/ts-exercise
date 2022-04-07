export namespace Hello {
	type T = string

	export function hello(message: T) {
		return `hello ${message}`
	}
}
