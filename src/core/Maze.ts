export enum CellType {
    WALL = 0,
    PATH = 1,
    ENTRANCE = 2,
    EXIT = 3,
}

export interface Cell {
    x: number;
    y: number;
    type: CellType;
    discovered: boolean;
    visible: boolean;
}

export interface Point {
    x: number;
    y: number;
}

export interface Maze {
    width: number;
    height: number;
    cells: Cell[][];
    entrance: Point;
    exit: Point;
}

export function createCell(x: number, y: number, type: CellType): Cell {
    return {
        x,
        y,
        type,
        discovered: false,
        visible: false,
    };
}
