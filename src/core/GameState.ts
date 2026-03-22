import { Maze } from './Maze.js';
import { Player } from './Player.js';

export interface LayerData {
    layer: number;
    maze: Maze;
    isGenerated: boolean;
}

export class GameState {
    private layers: Map<number, LayerData> = new Map();
    private currentLayer: number = 1;
    private maxLayers: number = 4;
    
    // 每层的难度配置
    private layerConfigs: Record<number, {
        width: number;
        height: number;
        complexity: number;
    }> = {
        1: { width: 31, height: 31, complexity: 1 },
        2: { width: 35, height: 35, complexity: 1.5 },
        3: { width: 41, height: 41, complexity: 2 },
        4: { width: 51, height: 51, complexity: 3 },
    };
    
    getCurrentLayer(): number {
        return this.currentLayer;
    }
    
    setCurrentLayer(layer: number): void {
        if (layer >= 1 && layer <= this.maxLayers) {
            this.currentLayer = layer;
        }
    }
    
    getLayerData(layer: number): LayerData | undefined {
        return this.layers.get(layer);
    }
    
    setLayerData(layer: number, data: LayerData): void {
        this.layers.set(layer, data);
    }
    
    hasLayerGenerated(layer: number): boolean {
        return this.layers.has(layer) && this.layers.get(layer)!.isGenerated;
    }
    
    getLayerConfig(layer: number) {
        return this.layerConfigs[layer] || this.layerConfigs[1];
    }
    
    getMaxLayers(): number {
        return this.maxLayers;
    }
    
    canGoUp(layer: number): boolean {
        return layer > 1;
    }
    
    canGoDown(layer: number): boolean {
        return layer < this.maxLayers;
    }
    
    // 获取层名称
    getLayerName(layer: number): string {
        const names = [
            '表层遗迹',
            '古代回廊',
            '迷失深渊',
            '混沌核心',
        ];
        return names[layer - 1] || `第${layer}层`;
    }
    
    // 获取层描述
    getLayerDescription(layer: number): string {
        const descriptions: Record<number, string> = {
            1: '相对安全的表层区域，适合新手探索',
            2: '古老的走廊，开始出现危险',
            3: '深层的迷宫，记忆衰退加快',
            4: '迷宫的核心，结构会不断变化',
        };
        return descriptions[layer] || '未知的区域';
    }
}
