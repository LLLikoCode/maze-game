import { Maze } from '../core/Maze.js';
export declare class MazeGenerator {
    private width;
    private height;
    private cells;
    private stack;
    constructor(width?: number, height?: number);
    generate(): Maze;
    private randomOdd;
    private getUnvisitedNeighbors;
    private findFarthestPoint;
    private findStairsLocation;
}
