import { Player, DrawnCell } from '../core/Player.js';

export interface MemoryConfig {
    layer: number;
    decayRate: number; // 每秒衰退百分比
    decayInterval: number; // 衰退检查间隔（秒）
}

export const MEMORY_CONFIGS: Record<number, MemoryConfig> = {
    1: { layer: 1, decayRate: 0.05, decayInterval: 60 }, // 表层：慢衰退
    2: { layer: 2, decayRate: 0.08, decayInterval: 60 }, // 中层
    3: { layer: 3, decayRate: 0.12, decayInterval: 60 }, // 深层
    4: { layer: 4, decayRate: 0.20, decayInterval: 60 }, // 混沌层：快衰退
};

export class MemorySystem {
    private lastDecayTime: number = Date.now();
    private accumulatedTime: number = 0;
    
    update(player: Player, currentLayer: number): void {
        const now = Date.now();
        const deltaTime = (now - this.lastDecayTime) / 1000; // 转换为秒
        this.lastDecayTime = now;
        
        this.accumulatedTime += deltaTime;
        
        const config = MEMORY_CONFIGS[currentLayer] || MEMORY_CONFIGS[1];
        
        // 检查是否到达衰退间隔
        if (this.accumulatedTime >= config.decayInterval) {
            this.applyDecay(player, config.decayRate);
            this.accumulatedTime = 0;
        }
    }
    
    private applyDecay(player: Player, decayRate: number): void {
        for (const [key, cell] of player.drawnCells) {
            // 墨水绘制的地图不衰减（这里简化处理，实际应该检查工具类型）
            if (cell.accuracy >= 0.95) {
                continue; // 高精度地图（羽毛笔/测绘仪）不衰减
            }
            
            // 应用衰退
            cell.accuracy -= decayRate;
            
            // 最低保留20%准确度（轮廓可见）
            if (cell.accuracy < 0.2) {
                cell.accuracy = 0.2;
            }
        }
    }
    
    refreshMemory(player: Player, x: number, y: number): void {
        const key = `${x},${y}`;
        const cell = player.drawnCells.get(key);
        
        if (cell) {
            // 回访刷新记忆，略微提升准确度
            cell.accuracy = Math.min(1, cell.accuracy + 0.1);
            cell.timestamp = Date.now();
        }
    }
    
    getMemoryLevel(accuracy: number): string {
        if (accuracy >= 0.9) return '清晰';
        if (accuracy >= 0.7) return '轻微模糊';
        if (accuracy >= 0.5) return '模糊';
        if (accuracy >= 0.3) return '很模糊';
        return '只剩轮廓';
    }
    
    getCellAlpha(accuracy: number): number {
        // 根据准确度返回透明度
        return 0.3 + accuracy * 0.7;
    }
}
