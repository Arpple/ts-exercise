import { pipeWith } from 'pipe-ts'
import { Cell } from "./cell";

export namespace Warehouse {
	export type T = {
		isVentilated: boolean,
		label: string,
		cells: Cell.T[],
		cellCaches: Set<string>,
	}

	export type Map = {
		warehouses: T[],
	}

	export function createMap(cellMap: Cell.Map): Map {
		const newMap: Map = {
			warehouses: []
		}

		return Cell.getCells(cellMap)
			.reduce((map, cell) => {
				const connectedWarehouses = getConnectedWarehouse(map, cell)
				if (connectedWarehouses.length === 0) {
					const warehouse = createWarehouse(cellMap, cell)

					return pipeWith(
						map,
						addWarehouse(warehouse),
					)

				} else if (connectedWarehouses.length === 1) {
					const warehouse = connectedWarehouses[0]
					warehouse.cells.push(cell)
					warehouse.cellCaches.add(createCellCache(cell))
					warehouse.isVentilated = warehouse.isVentilated || isVentilated(cellMap, cell)

					return map

				} else {
					const warehouse = mergeWarehouses(connectedWarehouses, cellMap, cell)

					return pipeWith(
						map,
						removeWarehouses(connectedWarehouses),
						addWarehouse(warehouse),
					)
				}
			}, newMap)
	}

	export function getWarehouses(map: Map): T[] {
		return map.warehouses
	}

	function createWarehouse(cellMap: Cell.Map, cell: Cell.T): T {
		return {
			cells: [cell],
			isVentilated: isVentilated(cellMap, cell),
			label: cell.label,
			cellCaches: new Set([createCellCache(cell)]),
		}
	}

	function mergeWarehouses(warehouses: T[], cellMap: Cell.Map, cell: Cell.T): T {
		const cells = [
			...warehouses.flatMap((w) => w.cells),
			cell,
		]

		return {
			isVentilated: warehouses.some((w) => w.isVentilated)
				|| isVentilated(cellMap, cell),
			label: cell.label,
			cells,
			cellCaches: new Set(cells.map(createCellCache)),
		}
	}

	function addWarehouse(warehouse: T) {
		return (map: Map): Map => {
			return {
				...map,
				warehouses: [...map.warehouses, warehouse]
			}
		}
	}

	function removeWarehouses(warehouses: T[]) {
		return (map: Map): Map => ({
			...map,
			warehouses: map.warehouses.filter((w) => !warehouses.includes(w))
		})
	}

	function getConnectedWarehouse(map: Map, cell: Cell.T): T[] {
		const left = createCellCache({ x: cell.x - 1, y: cell.y, label: cell.label })
		const up = createCellCache({ x: cell.x, y: cell.y - 1, label: cell.label })

		return map.warehouses
			.filter((w) => w.cellCaches.has(left) || w.cellCaches.has(up))
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

	function createCellCache(cell: Cell.T): string {
		return `${cell.x},${cell.y},${cell.label}`
	}
}
