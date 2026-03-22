import { Player, DrawnCell } from '../core/Player.js';
import { Maze, CellType } from '../core/Maze.js';

export class MapRenderer {
    private ctx: CanvasRenderingContext2D;
    private cellSize: number;
    private offsetX: number;
    private offsetY: number;
    
    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('无法获取Canvas上下文');
        }
        this.ctx = ctx;
        this.cellSize = 12;
        this.offsetX = 20;
        this.offsetY = 20;
    }
    
    render(player: Player, maze: Maze): void {
        const canvas = this.ctx.canvas;
        
        // 绘制羊皮纸背景
        this.ctx.fillStyle = '#f5f0e1';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制纸张纹理效果
        this.drawPaperTexture();
        
        // 计算中心偏移
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        this.offsetX = centerX - player.x * this.cellSize;
        this.offsetY = centerY - player.y * this.cellSize;
        
        // 绘制已绘制的格子
        for (const [key, cell] of player.drawnCells) {
            this.drawDrawnCell(cell);
        }
        
        // 绘制玩家当前位置标记
        const playerPx = this.offsetX + player.x * this.cellSize;
        const playerPy = this.offsetY + player.y * this.cellSize;
        this.drawPlayerMarker(playerPx, playerPy);
        
        // 绘制边框
        this.ctx.strokeStyle = '#3d2817';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
    
    private drawPaperTexture(): void {
        // 简单的纸张老化效果
        this.ctx.fillStyle = 'rgba(201, 184, 150, 0.1)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.ctx.canvas.width;
            const y = Math.random() * this.ctx.canvas.height;
            const size = Math.random() * 3 + 1;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    private drawDrawnCell(cell: DrawnCell): void {
        const px = this.offsetX + cell.x * this.cellSize;
        const py = this.offsetY + cell.y * this.cellSize;
        
        // 根据准确度调整透明度
        const alpha = 0.3 + cell.accuracy * 0.7;
        this.ctx.globalAlpha = alpha;
        
        // 铅笔绘制效果
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = 'round';
        
        // 添加轻微随机抖动模拟手绘
        const jitter = () => (Math.random() - 0.5) * 1.5;
        
        switch (cell.type) {
            case CellType.WALL:
                // 绘制墙壁（填充方块）
                this.ctx.fillStyle = '#999';
                this.ctx.fillRect(
                    px + jitter(), 
                    py + jitter(), 
                    this.cellSize - 2, 
                    this.cellSize - 2
                );
                break;
            case CellType.PATH:
                // 绘制通道（小点）
                this.ctx.fillStyle = '#666';
                this.ctx.fillRect(
                    px + this.cellSize / 3,
                    py + this.cellSize / 3,
                    this.cellSize / 3,
                    this.cellSize / 3
                );
                break;
            case CellType.ENTRANCE:
                // 入口标记
                this.ctx.strokeStyle = '#4a7c59';
                this.ctx.strokeRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
                this.ctx.fillStyle = '#4a7c59';
                this.ctx.font = `${this.cellSize * 0.7}px Arial`;
                this.ctx.fillText('入', px + 2, py + this.cellSize - 2);
                break;
            case CellType.EXIT:
                // 出口标记
                this.ctx.strokeStyle = '#8b3a3a';
                this.ctx.strokeRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
                this.ctx.fillStyle = '#8b3a3a';
                this.ctx.font = `${this.cellSize * 0.7}px Arial`;
                this.ctx.fillText('出', px + 2, py + this.cellSize - 2);
                break;
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    private drawPlayerMarker(px: number, py: number): void {
        const centerX = px + this.cellSize / 2;
        const centerY = py + this.cellSize / 2;
        
        // 绘制玩家位置（红色圆点）
        this.ctx.fillStyle = '#c9a227';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.cellSize * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 边框
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
    }
}
