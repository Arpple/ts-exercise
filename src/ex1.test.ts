import { readInt } from './ex1'

describe('read integer', () => {
	it('read from right to left', () => {
		const input = '123'
		const result = readInt(input)
		expect(result).toBe('321')
	})

	it('remove duplicate integer', () => {
		const input = '112233'
		const result = readInt(input)
		expect(result).toBe('321')
	})

	it('example', () => {
		const input = '9876673'
		const result = readInt(input)
		expect(result).toBe('37689')
	})
})
