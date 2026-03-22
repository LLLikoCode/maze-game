import { Maze, Cell, CellType } from '../core/Maze.js';
import { Player } from '../core/Player.js';

export class VisionSystem {
    updateVisibility(maze: Maze, player: Player): void {
        // 重置可见性
        for (let y = 0; y < maze.height; y++) {
            for (let x = 0; x < maze.width; x++) {
                maze.cells[y][x].visible = false;
            }
        }
        
        // 计算视野范围
        const radius = player.visionRadius;
        
        for (let y = player.y - radius; y <= player.y + radius; y++) {
            for (let x = player.x - radius; x <= player.x + radius; x++) {
                if (y >= 0 && y < maze.height && x >= 0 && x < maze.width) {
                    const distance = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);
                    if (distance <= radius) {
                        const cell = maze.cells[y][x];
                        cell.visible = true;
                        cell.discovered = true;
                    }
                }
            }
        }
    }
    
    isVisible(maze: Maze, x: number, y: number): boolean {
        if (y < 0 || y >= maze.height || x < 0 || x >= maze.width) {
            return false;
        }
        return maze.cells[y][x].visible;
    }
    
    isDiscovered(maze: Maze, x: number, y: number): boolean {
        if (y < 0 || y >= maze.height || x < 0 || x >= maze.width) {
            return false;
        }
        return maze.cells[y][x].discovered;
    }
}
