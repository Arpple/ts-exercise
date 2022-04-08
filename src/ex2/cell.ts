export namespace Cell {
	export type T = {
		x: number,
		y: number,
		label: string,
	}

	type Coordinate = string
	export type Map = Record<Coordinate, T>

	export function createMap(): Map {
		return {}
	}

	export function add(x: number, y: number, label: string) {
		return (map: Map): Map => {
			const isCoridor = label === 'O'
			if (isCoridor) {
				return map
			}

			const cell: T = {
				x, y, label,
			}

			return {
				...map,
				[coordString(x, y)]: cell,
			}
		}
	}

	export function get(map: Map, x: number, y: number): T | undefined {
		return map[coordString(x, y)]
	}

	export function getCells(map: Map): T[] {
		return Object.values(map)
	}

	function coordString(x: number, y: number): string {
		return `${x},${y}`
	}

	export function toString(cell: T): string {
		return `(${cell.x}, ${cell.y}, ${cell.label})`
	}
}
