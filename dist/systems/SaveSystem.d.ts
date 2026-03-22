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
export declare class SaveSystem {
    private readonly SAVE_KEY;
    private readonly VERSION;
    private startTime;
    private totalPlayTime;
    save(player: Player, gameState: GameState): boolean;
    load(): SaveData | null;
    hasSave(): boolean;
    delete(): boolean;
    autoSave(player: Player, gameState: GameState): void;
    exportSave(): string;
    importSave(base64: string): boolean;
    getPlayTime(): number;
    formatPlayTime(): string;
    private migrate;
}
