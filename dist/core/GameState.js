export class GameState {
    constructor() {
        this.layers = new Map();
        this.currentLayer = 1;
        this.maxLayers = 4;
        // 每层的难度配置
        this.layerConfigs = {
            1: { width: 31, height: 31, complexity: 1 },
            2: { width: 35, height: 35, complexity: 1.5 },
            3: { width: 41, height: 41, complexity: 2 },
            4: { width: 51, height: 51, complexity: 3 },
        };
    }
    getCurrentLayer() {
        return this.currentLayer;
    }
    setCurrentLayer(layer) {
        if (layer >= 1 && layer <= this.maxLayers) {
            this.currentLayer = layer;
        }
    }
    getLayerData(layer) {
        return this.layers.get(layer);
    }
    setLayerData(layer, data) {
        this.layers.set(layer, data);
    }
    hasLayerGenerated(layer) {
        return this.layers.has(layer) && this.layers.get(layer).isGenerated;
    }
    getLayerConfig(layer) {
        return this.layerConfigs[layer] || this.layerConfigs[1];
    }
    getMaxLayers() {
        return this.maxLayers;
    }
    canGoUp(layer) {
        return layer > 1;
    }
    canGoDown(layer) {
        return layer < this.maxLayers;
    }
    // 获取层名称
    getLayerName(layer) {
        const names = [
            '表层遗迹',
            '古代回廊',
            '迷失深渊',
            '混沌核心',
        ];
        return names[layer - 1] || `第${layer}层`;
    }
    // 获取层描述
    getLayerDescription(layer) {
        const descriptions = {
            1: '相对安全的表层区域，适合新手探索',
            2: '古老的走廊，开始出现危险',
            3: '深层的迷宫，记忆衰退加快',
            4: '迷宫的核心，结构会不断变化',
        };
        return descriptions[layer] || '未知的区域';
    }
}
//# sourceMappingURL=GameState.js.map