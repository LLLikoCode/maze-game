import { Player } from '../core/Player.js';
import { Maze } from '../core/Maze.js';
export declare class MapRenderer {
    private ctx;
    private cellSize;
    private offsetX;
    private offsetY;
    constructor(canvas: HTMLCanvasElement);
    render(player: Player, maze: Maze): void;
    private drawPaperTexture;
    private drawDrawnCell;
    private drawPlayerMarker;
}
