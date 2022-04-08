import { Cell } from './cell'
import { pipeWith } from 'pipe-ts'

describe('create and add cell', () => {
	const map = pipeWith(
		Cell.createMap(),
		Cell.add(0, 0, 'A'),
	)

	it('should not find non existing cell', () => {
		const cell = Cell.get(map, 1, 1)
		expect(cell).toBeUndefined()
	})

	it('should find added cell', () => {
		const cell = Cell.get(map, 0, 0) as Cell.T
		expect(cell.label).toBe('A')
		expect(cell.x).toBe(0)
		expect(cell.y).toBe(0)
	})
})

describe('create and add corridor cell "O"', () => {
	it('should ignore and not add to map', () => {
		const map = pipeWith(
			Cell.createMap(),
			Cell.add(0, 0, 'O'),
		)

		const cell = Cell.get(map, 0, 0)
		expect(cell).toBeUndefined()
	})
})
