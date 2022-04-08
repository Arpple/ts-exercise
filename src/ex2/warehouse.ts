import { pipeWith } from 'pipe-ts'
import { Cell } from "./cell";

export namespace Warehouse {
	export type T = {
		isVentilated: boolean,
		label: string,
		cells: Cell.T[],
	}

	export type Map = T[]

	export function createMap(cellMap: Cell.Map): Map {
		const newMap: Map = []

		return Cell.getCells(cellMap)
			.reduce((map, cell) => {
				const connectedWarehouses = getConnectedWarehouse(map, cell)
				if (connectedWarehouses.length === 0) {
					const newWarehouse: Warehouse.T = {
						isVentilated: isVentilated(cellMap, cell),
						label: cell.label,
						cells: [cell],
					}

					return pipeWith(
						map,
						addWarehouse(newWarehouse),
					)
				}

				if (connectedWarehouses.length === 1) {
					const warehouse = connectedWarehouses[0]
					warehouse.cells.push(cell)
					warehouse.isVentilated = warehouse.isVentilated
						|| isVentilated(cellMap, cell)

					return map
				}

				const mergedWarehouse: Warehouse.T = {
					isVentilated: connectedWarehouses.some((w) => w.isVentilated)
						|| isVentilated(cellMap, cell),
					label: cell.label,
					cells: [
						...connectedWarehouses.flatMap((w) => w.cells),
						cell,
					]
				}

				return pipeWith(
					map,
					removeWarehouses(connectedWarehouses),
					addWarehouse(mergedWarehouse),
				)
			}, newMap)
	}

	export function getWarehouses(map: Map): T[] {
		return map
	}

	function addWarehouse(warehouse: T) {
		return (map: Map): Map => {
			return [...map, warehouse]
		}
	}

	function removeWarehouses(warehouses: T[]) {
		return (map: Map): Map => map.filter((w) => !warehouses.includes(w))
	}

	function getConnectedWarehouse(map: Map, cell: Cell.T): T[] {
		const isCellConnected = (a: Cell.T, b: Cell.T): boolean => {
			return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1
		}

		return map
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
