import { Player } from '../core/Player.js';

export enum LightSourceType {
    NONE = 'none',
    TORCH = 'torch',
    LANTERN = 'lantern',
    GLOWSTONE = 'glowstone',
}

export interface LightSource {
    type: LightSourceType;
    name: string;
    radiusBonus: number;
    duration: number; // 剩余时间（秒）
    maxDuration: number;
    isActive: boolean;
}

export const LIGHT_SOURCE_DEFINITIONS: Record<LightSourceType, Omit<LightSource, 'duration' | 'isActive'>> = {
    [LightSourceType.NONE]: {
        type: LightSourceType.NONE,
        name: '无光源',
        radiusBonus: 0,
        maxDuration: 0,
    },
    [LightSourceType.TORCH]: {
        type: LightSourceType.TORCH,
        name: '火把',
        radiusBonus: 2,
        maxDuration: 600, // 10分钟
    },
    [LightSourceType.LANTERN]: {
        type: LightSourceType.LANTERN,
        name: '提灯',
        radiusBonus: 3,
        maxDuration: 1800, // 30分钟
    },
    [LightSourceType.GLOWSTONE]: {
        type: LightSourceType.GLOWSTONE,
        name: '荧光石',
        radiusBonus: 1,
        maxDuration: Infinity, // 永久
    },
};

export class LightSystem {
    private currentLight: LightSource | null = null;
    private lastUpdateTime: number = Date.now();
    
    // 黑暗环境下的视野惩罚
    private readonly DARKNESS_PENALTY = 2;
    private readonly BASE_VISION_RADIUS = 3;
    
    equipLightSource(player: Player, type: LightSourceType): boolean {
        const definition = LIGHT_SOURCE_DEFINITIONS[type];
        
        // 检查背包中是否有该光源
        if (type === LightSourceType.TORCH && player.torches <= 0) {
            return false;
        }
        
        // 消耗道具
        if (type === LightSourceType.TORCH) {
            player.torches--;
        }
        
        this.currentLight = {
            ...definition,
            duration: definition.maxDuration,
            isActive: true,
        };
        
        this.lastUpdateTime = Date.now();
        this.updatePlayerVision(player);
        
        return true;
    }
    
    unequipLightSource(): void {
        this.currentLight = null;
    }
    
    update(deltaTimeSeconds: number): void {
        if (!this.currentLight || !this.currentLight.isActive) {
            return;
        }
        
        // 更新剩余时间
        this.currentLight.duration -= deltaTimeSeconds;
        
        // 光源耗尽
        if (this.currentLight.duration <= 0) {
            this.currentLight.isActive = false;
            this.currentLight.duration = 0;
        }
    }
    
    getCurrentVisionRadius(player: Player): number {
        let radius = this.BASE_VISION_RADIUS;
        
        // 光源加成
        if (this.currentLight && this.currentLight.isActive) {
            radius += this.currentLight.radiusBonus;
        } else {
            // 无光源惩罚
            radius -= this.DARKNESS_PENALTY;
        }
        
        return Math.max(1, radius);
    }
    
    updatePlayerVision(player: Player): void {
        player.visionRadius = this.getCurrentVisionRadius(player);
    }
    
    getCurrentLight(): LightSource | null {
        return this.currentLight;
    }
    
    isInDarkness(): boolean {
        return !this.currentLight || !this.currentLight.isActive;
    }
    
    getLightStatusText(): string {
        if (!this.currentLight) {
            return '无光源 ⚠️';
        }
        
        if (!this.currentLight.isActive) {
            return `${this.currentLight.name} (已耗尽)`;
        }
        
        const minutes = Math.floor(this.currentLight.duration / 60);
        const seconds = Math.floor(this.currentLight.duration % 60);
        return `${this.currentLight.name} (${minutes}:${seconds.toString().padStart(2, '0')})`;
    }
}
