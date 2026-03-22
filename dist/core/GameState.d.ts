import { Maze } from './Maze.js';
export interface LayerData {
    layer: number;
    maze: Maze;
    isGenerated: boolean;
}
export declare class GameState {
    private layers;
    private currentLayer;
    private maxLayers;
    private layerConfigs;
    getCurrentLayer(): number;
    setCurrentLayer(layer: number): void;
    getLayerData(layer: number): LayerData | undefined;
    setLayerData(layer: number, data: LayerData): void;
    hasLayerGenerated(layer: number): boolean;
    getLayerConfig(layer: number): {
        width: number;
        height: number;
        complexity: number;
    };
    getMaxLayers(): number;
    canGoUp(layer: number): boolean;
    canGoDown(layer: number): boolean;
    getLayerName(layer: number): string;
    getLayerDescription(layer: number): string;
}
