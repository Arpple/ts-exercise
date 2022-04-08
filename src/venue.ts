import { VenueMap } from './map'

export namespace Venue {
	type Warehouse = {
		isVentilated: boolean,
		label: string,
		cells: VenueMap.Cell[],
	}

	type Cell = VenueMap.Cell
	type CellMap = VenueMap.Map

	export function getWarehouseSpace(input: string[]): number {
		const cellMap = parseMap(input)

		const possibleWarehouses = Object.values(cellMap)
			.reduce((warehouses, cell) => {
				const connectedWarehouse = getConnectedWarehouse(warehouses, cell)
				if (connectedWarehouse) {
					connectedWarehouse.cells.push(cell)
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

	function parseMap(input: string[]): CellMap {
		return input.reduce(parseRow, VenueMap.createMap())
	}

	function parseRow(map: CellMap, row: string, rowIndex: number): CellMap {
		const cellLabels = row.split('')
		return cellLabels.reduce((newMap, label, x) => {
			return VenueMap.addCell(newMap, x, rowIndex, label)
		}, map)
	}

	function isCellConnected(cellA: Cell, cellB: Cell): boolean {
		return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y) === 1
	}

	function getConnectedWarehouse(warehouses: Warehouse[], cell: Cell): Warehouse | undefined {
		return warehouses
			.find((w) => w.label === cell.label
				&& w.cells.find((c) => isCellConnected(c, cell))
			)
	}

	function isVentilated(map: CellMap, cell: Cell): boolean {
		const left = VenueMap.get(map, cell.x - 1, cell.y)
		const right = VenueMap.get(map, cell.x + 1, cell.y)
		const up = VenueMap.get(map, cell.x, cell.y - 1)
		const down = VenueMap.get(map, cell.x, cell.y + 1)

		const isVentilated = left === undefined
			|| right === undefined
			|| up === undefined
			|| down === undefined

		return isVentilated
	}
}
