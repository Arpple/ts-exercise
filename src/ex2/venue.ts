import { Cell } from './cell'

export namespace Venue {
	type Warehouse = {
		isVentilated: boolean,
		label: string,
		cells: Cell.T[],
	}

	export function getWarehouseSpace(input: string[]): number {
		const cellMap = parseMap(input)

		const possibleWarehouses = Object.values(cellMap)
			.reduce((warehouses, cell) => {
				const connectedWarehouse = getConnectedWarehouse(warehouses, cell)
				if (connectedWarehouse) {
					connectedWarehouse.cells.push(cell)
					connectedWarehouse.isVentilated = connectedWarehouse.isVentilated
						|| isVentilated(cellMap, cell)

					return warehouses

				}	else {
					const newWarehouse: Warehouse = {
						isVentilated: isVentilated(cellMap, cell),
						label: cell.label,
						cells: [cell],
					}

					return [...warehouses, newWarehouse]
				}
			}, [] as Warehouse[])

		return possibleWarehouses
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

	function isCellConnected(cellA: Cell.T, cellB: Cell.T): boolean {
		return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y) === 1
	}

	function getConnectedWarehouse(warehouses: Warehouse[], cell: Cell.T): Warehouse | undefined {
		return warehouses
			.find((w) => w.label === cell.label
				&& w.cells.find((c) => isCellConnected(c, cell))
			)
	}

	function isVentilated(map: Cell.Map, cell: Cell.T): boolean {
		const left = Cell.get(map, cell.x - 1, cell.y)
		const right = Cell.get(map, cell.x + 1, cell.y)
		const up = Cell.get(map, cell.x, cell.y - 1)
		const down = Cell.get(map, cell.x, cell.y + 1)

		const isVentilated = left === undefined
			|| right === undefined
			|| up === undefined
			|| down === undefined

		return isVentilated
	}
}
