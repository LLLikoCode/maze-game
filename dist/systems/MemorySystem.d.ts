import { Player } from '../core/Player.js';
export interface MemoryConfig {
    layer: number;
    decayRate: number;
    decayInterval: number;
}
export declare const MEMORY_CONFIGS: Record<number, MemoryConfig>;
export declare class MemorySystem {
    private lastDecayTime;
    private accumulatedTime;
    update(player: Player, currentLayer: number): void;
    private applyDecay;
    refreshMemory(player: Player, x: number, y: number): void;
    getMemoryLevel(accuracy: number): string;
    getCellAlpha(accuracy: number): number;
}
