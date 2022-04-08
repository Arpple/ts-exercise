import { pipeWith } from 'pipe-ts'
import { Cell } from "./cell";

export namespace Warehouse {
	export type T = {
		isVentilated: boolean,
		label: string,
		cells: Cell.T[],
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
					return pipeWith(
						map,
						addWarehouse(createWarehouse(cellMap, cell)),
					)

				} else if (connectedWarehouses.length === 1) {
					const warehouse = connectedWarehouses[0]
					warehouse.cells.push(cell)
					warehouse.isVentilated = warehouse.isVentilated
						|| isVentilated(cellMap, cell)

					return map

				} else {
					return pipeWith(
						map,
						removeWarehouses(connectedWarehouses),
						addWarehouse(mergeWarehouses(connectedWarehouses, cellMap, cell)),
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
		}
	}

	function mergeWarehouses(warehouses: T[], cellMap: Cell.Map, cell: Cell.T): T {
		return {
			isVentilated: warehouses.some((w) => w.isVentilated)
				|| isVentilated(cellMap, cell),
			label: cell.label,
			cells: [
				...warehouses.flatMap((w) => w.cells),
				cell,
			]
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
		const isCellConnected = (a: Cell.T, b: Cell.T): boolean => {
			return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1
		}

		return map.warehouses
			.filter((w) => w.label === cell.label)
			.filter((w) => w.cells.find((c) => isCellConnected(c, cell)))
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
