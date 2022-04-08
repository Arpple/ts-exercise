export namespace VenueMap {
	export type Cell = {
		x: number,
		y: number,
		label: string,
	}

	type Coordinate = string
	export type Map = Record<Coordinate, Cell>

	export function createMap(): Map {
		return {}
	}

	export function addCell(x: number, y: number, label: string) {
		return (map: Map): Map => {
			const isCoridor = label === 'O'
			if (isCoridor) {
				return map
			}

			const cell: Cell = {
				x, y, label,
			}

			return {
				...map,
				[coordString(x, y)]: cell,
			}
		}
	}

	export function get(map: Map, x: number, y: number): Cell | undefined {
		return map[coordString(x, y)]
	}

	function coordString(x: number, y: number): string {
		return `${x},${y}`
	}
}
