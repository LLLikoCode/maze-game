import { Player } from '../core/Player.js';
import { Maze } from '../core/Maze.js';
import { GameState } from '../core/GameState.js';

export interface SaveData {
    version: string;
    timestamp: number;
    player: Player;
    currentLayer: number;
    layerData: Record<number, {
        maze: Maze;
        isGenerated: boolean;
    }>;
    playTime: number;
}

export class SaveSystem {
    private readonly SAVE_KEY = 'maze_game_save_v1';
    private readonly VERSION = '1.0';
    private startTime: number = Date.now();
    private totalPlayTime: number = 0;
    
    save(player: Player, gameState: GameState): boolean {
        try {
            const layerData: Record<number, any> = {};
            
            // 保存所有层的数据
            for (let i = 1; i <= gameState.getMaxLayers(); i++) {
                const data = gameState.getLayerData(i);
                if (data) {
                    layerData[i] = {
                        maze: data.maze,
                        isGenerated: data.isGenerated,
                    };
                }
            }
            
            const saveData: SaveData = {
                version: this.VERSION,
                timestamp: Date.now(),
                player,
                currentLayer: gameState.getCurrentLayer(),
                layerData,
                playTime: this.totalPlayTime + (Date.now() - this.startTime),
            };
            
            const json = JSON.stringify(saveData);
            localStorage.setItem(this.SAVE_KEY, json);
            
            return true;
        } catch (e) {
            console.error('保存失败:', e);
            return false;
        }
    }
    
    load(): SaveData | null {
        try {
            const json = localStorage.getItem(this.SAVE_KEY);
            if (!json) return null;
            
            const data = JSON.parse(json) as SaveData;
            
            // 版本检查
            if (data.version !== this.VERSION) {
                console.warn('存档版本不匹配，尝试迁移...');
                return this.migrate(data);
            }
            
            // 恢复游戏时间
            this.totalPlayTime = data.playTime || 0;
            this.startTime = Date.now();
            
            return data;
        } catch (e) {
            console.error('读取存档失败:', e);
            return null;
        }
    }
    
    hasSave(): boolean {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }
    
    delete(): boolean {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    autoSave(player: Player, gameState: GameState): void {
        // 自动保存（每5分钟）
        setInterval(() => {
            this.save(player, gameState);
            console.log('自动保存完成');
        }, 5 * 60 * 1000);
    }
    
    exportSave(): string {
        const data = localStorage.getItem(this.SAVE_KEY);
        return data ? btoa(data) : '';
    }
    
    importSave(base64: string): boolean {
        try {
            const json = atob(base64);
            // 验证JSON格式
            JSON.parse(json);
            localStorage.setItem(this.SAVE_KEY, json);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    getPlayTime(): number {
        return this.totalPlayTime + (Date.now() - this.startTime);
    }
    
    formatPlayTime(): string {
        const total = this.getPlayTime();
        const hours = Math.floor(total / (1000 * 60 * 60));
        const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((total % (1000 * 60)) / 1000);
        
        if (hours > 0) {
            return `${hours}小时${minutes}分钟`;
        } else if (minutes > 0) {
            return `${minutes}分钟${seconds}秒`;
        } else {
            return `${seconds}秒`;
        }
    }
    
    private migrate(oldData: SaveData): SaveData {
        // 版本迁移逻辑
        return oldData;
    }
}
