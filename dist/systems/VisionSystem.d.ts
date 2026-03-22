import { Maze } from '../core/Maze.js';
import { Player } from '../core/Player.js';
export declare class VisionSystem {
    updateVisibility(maze: Maze, player: Player): void;
    isVisible(maze: Maze, x: number, y: number): boolean;
    isDiscovered(maze: Maze, x: number, y: number): boolean;
}
