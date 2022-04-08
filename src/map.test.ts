import { VenueMap } from './map'
import { pipeWith } from 'pipe-ts'

describe('create and add cell', () => {
	const map = pipeWith(
		VenueMap.createMap(),
		VenueMap.addCell(0, 0, 'A'),
	)

	it('should not find non existing cell', () => {
		const cell = VenueMap.get(map, 1, 1)
		expect(cell).toBeUndefined()
	})

	it('should find added cell', () => {
		const cell = VenueMap.get(map, 0, 0) as VenueMap.Cell
		expect(cell.label).toBe('A')
		expect(cell.x).toBe(0)
		expect(cell.y).toBe(0)
	})
})

describe('create and add corridor cell "O"', () => {
	it('should ignore and not add to map', () => {
		const map = pipeWith(
			VenueMap.createMap(),
			VenueMap.addCell(0, 0, 'A'),
		)

		const cell = VenueMap.get(map, 0, 0)
		expect(cell).toBeUndefined()
	})
})
