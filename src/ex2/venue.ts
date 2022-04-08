import { Cell } from './cell'
import { Warehouse } from './warehouse'

export namespace Venue {
	export function getWarehouseSpace(input: string[]): number {
		const cellMap = parseMap(input)
		const warehouseMap = Warehouse.createMap(cellMap)

		return warehouseMap
			.filter((w) => !w.isVentilated)
			.reduce((maxSpace, warehouse) => {
				const space = warehouse.cells.length
				return space > maxSpace
					? space
					: maxSpace
			}, 0)
	}

	function parseMap(input: string[]): Cell.Map {
		return input.reduce(
			(map, row, y) => {
				const cellLabels = row.split('')

				return cellLabels.reduce(
					(rowMap, label, x) => Cell.add(x, y, label)(rowMap),
					map
				)
			},
			Cell.createMap()
		)
	}
}
