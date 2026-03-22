import { CellType, createCell } from '../core/Maze.js';
export class MazeGenerator {
    constructor(width = 31, height = 31) {
        // 确保奇数尺寸
        this.width = width % 2 === 0 ? width + 1 : width;
        this.height = height % 2 === 0 ? height + 1 : height;
        this.cells = [];
        this.stack = [];
    }
    generate() {
        // 初始化全为墙
        this.cells = [];
        for (let y = 0; y < this.height; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x] = createCell(x, y, CellType.WALL);
            }
        }
        // 从随机奇数点开始
        const startX = this.randomOdd(1, this.width - 2);
        const startY = this.randomOdd(1, this.height - 2);
        this.stack.push({ x: startX, y: startY });
        this.cells[startY][startX].type = CellType.PATH;
        // 递归回溯
        while (this.stack.length > 0) {
            const current = this.stack[this.stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(current);
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                // 打通墙壁
                const wallX = (current.x + next.x) / 2;
                const wallY = (current.y + next.y) / 2;
                this.cells[wallY][wallX].type = CellType.PATH;
                this.cells[next.y][next.x].type = CellType.PATH;
                this.stack.push(next);
            }
            else {
                this.stack.pop();
            }
        }
        // 设置入口和出口
        const entrance = this.findFarthestPoint({ x: startX, y: startY });
        const exit = this.findFarthestPoint(entrance);
        this.cells[entrance.y][entrance.x].type = CellType.ENTRANCE;
        this.cells[exit.y][exit.x].type = CellType.EXIT;
        // 设置楼梯
        const stairsUp = this.findStairsLocation(this.cells, entrance, exit, true);
        const stairsDown = this.findStairsLocation(this.cells, entrance, exit, false);
        if (stairsUp) {
            this.cells[stairsUp.y][stairsUp.x].type = CellType.STAIRS_UP;
        }
        if (stairsDown) {
            this.cells[stairsDown.y][stairsDown.x].type = CellType.STAIRS_DOWN;
        }
        return {
            width: this.width,
            height: this.height,
            layer: 1,
            cells: this.cells,
            entrance,
            exit,
            stairsUp,
            stairsDown,
        };
    }
    randomOdd(min, max) {
        const range = Math.floor((max - min) / 2) + 1;
        return min + Math.floor(Math.random() * range) * 2;
    }
    getUnvisitedNeighbors(p) {
        const neighbors = [];
        const dirs = [
            { x: 0, y: -2 },
            { x: 2, y: 0 },
            { x: 0, y: 2 },
            { x: -2, y: 0 },
        ];
        for (const dir of dirs) {
            const nx = p.x + dir.x;
            const ny = p.y + dir.y;
            if (nx > 0 && nx < this.width - 1 && ny > 0 && ny < this.height - 1) {
                if (this.cells[ny][nx].type === CellType.WALL) {
                    neighbors.push({ x: nx, y: ny });
                }
            }
        }
        return neighbors;
    }
    findFarthestPoint(start) {
        const queue = [start];
        const visited = new Set([`${start.x},${start.y}`]);
        let farthest = start;
        while (queue.length > 0) {
            const current = queue.shift();
            farthest = current;
            const dirs = [
                { x: 0, y: -1 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: -1, y: 0 },
            ];
            for (const dir of dirs) {
                const nx = current.x + dir.x;
                const ny = current.y + dir.y;
                const key = `${nx},${ny}`;
                if (!visited.has(key) &&
                    ny >= 0 && ny < this.height &&
                    nx >= 0 && nx < this.width &&
                    this.cells[ny][nx].type !== CellType.WALL) {
                    visited.add(key);
                    queue.push({ x: nx, y: ny });
                }
            }
        }
        return farthest;
    }
    findStairsLocation(cells, entrance, exit, findUp) {
        // 寻找距离入口和出口都适中的位置放置楼梯
        const candidates = [];
        const minDistance = 5;
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                if (cells[y][x].type === CellType.PATH) {
                    const distToEntrance = Math.abs(x - entrance.x) + Math.abs(y - entrance.y);
                    const distToExit = Math.abs(x - exit.x) + Math.abs(y - exit.y);
                    // 楼梯不能太靠近入口或出口
                    if (distToEntrance > minDistance && distToExit > minDistance) {
                        candidates.push({ x, y });
                    }
                }
            }
        }
        if (candidates.length === 0)
            return null;
        // 随机选择一个位置
        return candidates[Math.floor(Math.random() * candidates.length)];
    }
}
//# sourceMappingURL=MazeGenerator.js.map