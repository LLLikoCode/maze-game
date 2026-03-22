import { MazeGenerator } from './generation/MazeGenerator.js';
import { Maze, CellType } from './core/Maze.js';
import { createPlayer, movePlayer, drawCellOnMap } from './core/Player.js';
import { Player } from './core/Player.js';
import { VisionSystem } from './systems/VisionSystem.js';
import { MazeRenderer } from './rendering/MazeRenderer.js';
import { MapRenderer } from './rendering/MapRenderer.js';
import { InputHandler } from './input/InputHandler.js';

class Game {
    private maze!: Maze;
    private player!: Player;
    private visionSystem: VisionSystem;
    private mazeRenderer: MazeRenderer;
    private mapRenderer: MapRenderer;
    private inputHandler: InputHandler;
    
    private mazeCanvas: HTMLCanvasElement;
    private mapCanvas: HTMLCanvasElement;
    private messageLog: HTMLElement;
    
    constructor() {
        // 获取Canvas元素
        this.mazeCanvas = document.getElementById('maze-canvas') as HTMLCanvasElement;
        this.mapCanvas = document.getElementById('map-canvas') as HTMLCanvasElement;
        this.messageLog = document.getElementById('message-log') as HTMLElement;
        
        // 初始化系统
        this.visionSystem = new VisionSystem();
        this.mazeRenderer = new MazeRenderer(this.mazeCanvas, 16);
        this.mapRenderer = new MapRenderer(this.mapCanvas);
        this.inputHandler = new InputHandler();
        
        // 生成迷宫
        this.generateNewMaze();
        
        // 设置输入监听
        this.setupInput();
        
        // 初始渲染
        this.render();
        
        this.log('游戏初始化完成', 'important');
    }
    
    private generateNewMaze(): void {
        const generator = new MazeGenerator(31, 31);
        this.maze = generator.generate();
        this.player = createPlayer(this.maze.entrance.x, this.maze.entrance.y);
        
        // 更新视野
        this.visionSystem.updateVisibility(this.maze, this.player);
        
        this.log('新的迷宫已生成', 'important');
        this.log(`入口: (${this.maze.entrance.x}, ${this.maze.entrance.y})`);
        this.log(`出口: (${this.maze.exit.x}, ${this.maze.exit.y})`);
    }
    
    private setupInput(): void {
        this.inputHandler.on('move_up', () => this.move(0, -1));
        this.inputHandler.on('move_down', () => this.move(0, 1));
        this.inputHandler.on('move_left', () => this.move(-1, 0));
        this.inputHandler.on('move_right', () => this.move(1, 0));
        this.inputHandler.on('draw_map', () => this.drawMap());
        this.inputHandler.on('regenerate', () => this.regenerate());
    }
    
    private move(dx: number, dy: number): void {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        // 检查边界
        if (newX < 0 || newX >= this.maze.width || newY < 0 || newY >= this.maze.height) {
            return;
        }
        
        // 检查墙壁
        const cell = this.maze.cells[newY][newX];
        if (cell.type === CellType.WALL) {
            this.log('撞到了墙壁！', 'danger');
            return;
        }
        
        // 移动
        movePlayer(this.player, dx, dy);
        
        // 更新视野
        this.visionSystem.updateVisibility(this.maze, this.player);
        
        // 检查到达出口
        if (cell.type === CellType.EXIT) {
            this.log('🎉 恭喜！你找到了出口！', 'important');
        }
        
        this.updateUI();
        this.render();
    }
    
    private drawMap(): void {
        // 绘制当前视野内的所有格子
        let drawnCount = 0;
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                if (this.maze.cells[y][x].visible) {
                    const success = drawCellOnMap(
                        this.player, 
                        x, 
                        y, 
                        this.maze.cells[y][x].type
                    );
                    if (success) drawnCount++;
                }
            }
        }
        
        if (drawnCount > 0) {
            this.log(`绘制了 ${drawnCount} 个格子到地图上`);
            this.updateUI();
            this.render();
        } else {
            this.log('没有可绘制的区域', 'danger');
        }
    }
    
    private regenerate(): void {
        this.generateNewMaze();
        this.updateUI();
        this.render();
    }
    
    private render(): void {
        this.mazeRenderer.render(this.maze, this.player);
        this.mapRenderer.render(this.player, this.maze);
    }
    
    private updateUI(): void {
        // 更新状态面板
        document.getElementById('stamina')!.textContent = 
            `${this.player.stamina}/${this.player.maxStamina}`;
        document.getElementById('position')!.textContent = 
            `${this.player.x}, ${this.player.y}`;
        document.getElementById('layer')!.textContent = 
            `${this.player.layer}`;
        document.getElementById('vision')!.textContent = 
            `${this.player.visionRadius}格`;
        
        // 更新背包
        document.getElementById('paper')!.textContent = 
            `${this.player.paper}`;
        document.getElementById('pencil')!.textContent = 
            `${this.player.pencilDurability}%`;
        document.getElementById('torch')!.textContent = 
            `${this.player.torches}`;
    }
    
    private log(message: string, type: 'normal' | 'important' | 'danger' = 'normal'): void {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.messageLog.appendChild(div);
        this.messageLog.scrollTop = this.messageLog.scrollHeight;
    }
}

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
