export const MEMORY_CONFIGS = {
    1: { layer: 1, decayRate: 0.05, decayInterval: 60 }, // 表层：慢衰退
    2: { layer: 2, decayRate: 0.08, decayInterval: 60 }, // 中层
    3: { layer: 3, decayRate: 0.12, decayInterval: 60 }, // 深层
    4: { layer: 4, decayRate: 0.20, decayInterval: 60 }, // 混沌层：快衰退
};
export class MemorySystem {
    constructor() {
        this.lastDecayTime = Date.now();
        this.accumulatedTime = 0;
    }
    update(player, currentLayer) {
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
    applyDecay(player, decayRate) {
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
    refreshMemory(player, x, y) {
        const key = `${x},${y}`;
        const cell = player.drawnCells.get(key);
        if (cell) {
            // 回访刷新记忆，略微提升准确度
            cell.accuracy = Math.min(1, cell.accuracy + 0.1);
            cell.timestamp = Date.now();
        }
    }
    getMemoryLevel(accuracy) {
        if (accuracy >= 0.9)
            return '清晰';
        if (accuracy >= 0.7)
            return '轻微模糊';
        if (accuracy >= 0.5)
            return '模糊';
        if (accuracy >= 0.3)
            return '很模糊';
        return '只剩轮廓';
    }
    getCellAlpha(accuracy) {
        // 根据准确度返回透明度
        return 0.3 + accuracy * 0.7;
    }
}
//# sourceMappingURL=MemorySystem.js.map