import { pipeWith } from 'pipe-ts'
import { Cell } from "./cell";

export namespace Warehouse {
	export type T = {
		isVentilated: boolean,
		label: string,
		cells: Cell.T[],
	}

	type Coordinate = string
	export type Map = {
		warehouses: T[],
		coordMap: Record<Coordinate, T>,
	}

	export function createMap(cellMap: Cell.Map): Map {
		const newMap: Map = {
			coordMap: {},
			warehouses: [],
		}

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
						updateCoord(newWarehouse, cell),
					)
				}

				if (connectedWarehouses.length === 1) {
					const warehouse = connectedWarehouses[0]
					warehouse.cells.push(cell)
					warehouse.isVentilated = warehouse.isVentilated
						|| isVentilated(cellMap, cell)

					return pipeWith(
						map,
						updateCoord(warehouse, cell),
					)
				}

				return map
			}, newMap)
	}

	export function getWarehouses(map: Map): T[] {
		return map.warehouses
	}

	function addWarehouse(warehouse: T) {
		return (map: Map): Map => {
			return {
				...map,
				warehouses: [...map.warehouses, warehouse],
			}
		}
	}

	function updateCoord(warehouse: T, cell: Cell.T) {
		return (map: Map): Map => ({
			...map,
			coordMap: {
				...map.coordMap,
				[coordString(cell.x, cell.y)]: warehouse,
			}
		})
	}

	function coordString(x: number, y: number): string {
		return `${x},${y}`
	}

	function get(map: Map, x: number, y: number): T | undefined {
		return map.coordMap[coordString(x, y)]
	}

	function getConnectedWarehouse(map: Map, cell: Cell.T): T[] {
		const left = get(map, cell.x - 1, cell.y)
		const right = get(map, cell.x + 1, cell.y)
		const up = get(map, cell.x, cell.y - 1)
		const down = get(map, cell.x, cell.y + 1)

		return [left, right, up, down]
			.filter((w): w is T => w !== undefined)
			.filter((w) => w?.label === cell.label)
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
