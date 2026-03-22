import { Maze } from '../core/Maze.js';
import { Player } from '../core/Player.js';
export declare class MazeRenderer {
    private ctx;
    private cellSize;
    constructor(canvas: HTMLCanvasElement, cellSize?: number);
    render(maze: Maze, player: Player): void;
    private drawCell;
    private drawPlayer;
    setCellSize(size: number): void;
}
