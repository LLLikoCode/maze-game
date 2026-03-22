import { Player } from '../core/Player.js';
export declare enum LightSourceType {
    NONE = "none",
    TORCH = "torch",
    LANTERN = "lantern",
    GLOWSTONE = "glowstone"
}
export interface LightSource {
    type: LightSourceType;
    name: string;
    radiusBonus: number;
    duration: number;
    maxDuration: number;
    isActive: boolean;
}
export declare const LIGHT_SOURCE_DEFINITIONS: Record<LightSourceType, Omit<LightSource, 'duration' | 'isActive'>>;
export declare class LightSystem {
    private currentLight;
    private lastUpdateTime;
    private readonly DARKNESS_PENALTY;
    private readonly BASE_VISION_RADIUS;
    equipLightSource(player: Player, type: LightSourceType): boolean;
    unequipLightSource(): void;
    update(deltaTimeSeconds: number): void;
    getCurrentVisionRadius(player: Player): number;
    updatePlayerVision(player: Player): void;
    getCurrentLight(): LightSource | null;
    isInDarkness(): boolean;
    getLightStatusText(): string;
}
