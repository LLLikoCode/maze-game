export var LightSourceType;
(function (LightSourceType) {
    LightSourceType["NONE"] = "none";
    LightSourceType["TORCH"] = "torch";
    LightSourceType["LANTERN"] = "lantern";
    LightSourceType["GLOWSTONE"] = "glowstone";
})(LightSourceType || (LightSourceType = {}));
export const LIGHT_SOURCE_DEFINITIONS = {
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
    constructor() {
        this.currentLight = null;
        this.lastUpdateTime = Date.now();
        // 黑暗环境下的视野惩罚
        this.DARKNESS_PENALTY = 2;
        this.BASE_VISION_RADIUS = 3;
    }
    equipLightSource(player, type) {
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
    unequipLightSource() {
        this.currentLight = null;
    }
    update(deltaTimeSeconds) {
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
    getCurrentVisionRadius(player) {
        let radius = this.BASE_VISION_RADIUS;
        // 光源加成
        if (this.currentLight && this.currentLight.isActive) {
            radius += this.currentLight.radiusBonus;
        }
        else {
            // 无光源惩罚
            radius -= this.DARKNESS_PENALTY;
        }
        return Math.max(1, radius);
    }
    updatePlayerVision(player) {
        player.visionRadius = this.getCurrentVisionRadius(player);
    }
    getCurrentLight() {
        return this.currentLight;
    }
    isInDarkness() {
        return !this.currentLight || !this.currentLight.isActive;
    }
    getLightStatusText() {
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
//# sourceMappingURL=LightSystem.js.map