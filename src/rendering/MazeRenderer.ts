import { Maze, Cell, CellType } from '../core/Maze.js';
import { Player } from '../core/Player.js';

export class MazeRenderer {
    private ctx: CanvasRenderingContext2D;
    private cellSize: number;
    
    constructor(canvas: HTMLCanvasElement, cellSize: number = 16) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('无法获取Canvas上下文');
        }
        this.ctx = ctx;
        this.cellSize = cellSize;
    }
    
    render(maze: Maze, player: Player): void {
        const canvas = this.ctx.canvas;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 计算视野偏移（以玩家为中心）
        const viewWidth = canvas.width / this.cellSize;
        const viewHeight = canvas.height / this.cellSize;
        const offsetX = Math.max(0, player.x - viewWidth / 2);
        const offsetY = Math.max(0, player.y - viewHeight / 2);
        
        const startX = Math.floor(offsetX);
        const startY = Math.floor(offsetY);
        const endX = Math.min(maze.width, startX + viewWidth + 1);
        const endY = Math.min(maze.height, startY + viewHeight + 1);
        
        // 绘制迷宫
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const cell = maze.cells[y][x];
                const px = (x - offsetX) * this.cellSize;
                const py = (y - offsetY) * this.cellSize;
                
                this.drawCell(cell, px, py);
            }
        }
        
        // 绘制玩家
        const playerPx = (player.x - offsetX) * this.cellSize;
        const playerPy = (player.y - offsetY) * this.cellSize;
        this.drawPlayer(playerPx, playerPy);
    }
    
    private drawCell(cell: Cell, px: number, py: number): void {
        // 未发现的区域
        if (!cell.discovered) {
            this.ctx.fillStyle = '#0a0a0a';
            this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
            return;
        }
        
        // 已发现但不可见
        if (!cell.visible) {
            this.ctx.fillStyle = '#2a2520';
            this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
            return;
        }
        
        // 根据类型绘制
        switch (cell.type) {
            case CellType.WALL:
                this.ctx.fillStyle = '#444';
                this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
                // 墙壁纹理
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(px + 2, py + 2, this.cellSize - 4, this.cellSize - 4);
                break;
            case CellType.PATH:
                this.ctx.fillStyle = '#d4c4a8';
                this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
                break;
            case CellType.ENTRANCE:
                this.ctx.fillStyle = '#4a7c59';
                this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
                // 入口标记
                this.ctx.fillStyle = '#fff';
                this.ctx.font = `${this.cellSize * 0.6}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('入', px + this.cellSize / 2, py + this.cellSize / 2);
                break;
            case CellType.EXIT:
                this.ctx.fillStyle = '#8b3a3a';
                this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
                // 出口标记
                this.ctx.fillStyle = '#fff';
                this.ctx.font = `${this.cellSize * 0.6}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('出', px + this.cellSize / 2, py + this.cellSize / 2);
                break;
        }
        
        // 绘制网格线
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeRect(px, py, this.cellSize, this.cellSize);
    }
    
    private drawPlayer(px: number, py: number): void {
        const centerX = px + this.cellSize / 2;
        const centerY = py + this.cellSize / 2;
        const radius = this.cellSize * 0.35;
        
        // 玩家光晕
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, this.cellSize * 1.5
        );
        gradient.addColorStop(0, 'rgba(255, 170, 68, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 170, 68, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(px - this.cellSize, py - this.cellSize, this.cellSize * 3, this.cellSize * 3);
        
        // 玩家本体
        this.ctx.fillStyle = '#c9a227';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 边框
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    setCellSize(size: number): void {
        this.cellSize = size;
    }
}
