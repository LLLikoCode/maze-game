export var CellType;
(function (CellType) {
    CellType[CellType["WALL"] = 0] = "WALL";
    CellType[CellType["PATH"] = 1] = "PATH";
    CellType[CellType["ENTRANCE"] = 2] = "ENTRANCE";
    CellType[CellType["EXIT"] = 3] = "EXIT";
    CellType[CellType["STAIRS_UP"] = 4] = "STAIRS_UP";
    CellType[CellType["STAIRS_DOWN"] = 5] = "STAIRS_DOWN";
})(CellType || (CellType = {}));
export function createCell(x, y, type) {
    return {
        x,
        y,
        type,
        discovered: false,
        visible: false,
    };
}
//# sourceMappingURL=Maze.js.map