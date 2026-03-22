import { InventorySystem } from '../systems/InventorySystem.js';
export interface Player {
    x: number;
    y: number;
    layer: number;
    stamina: number;
    maxStamina: number;
    visionRadius: number;
    inventory: InventorySystem;
    paper: number;
    pencilDurability: number;
    torches: number;
    drawnCells: Map<string, DrawnCell>;
    equippedLight: string | null;
}
export interface DrawnCell {
    x: number;
    y: number;
    type: number;
    accuracy: number;
    timestamp: number;
}
export declare function createPlayer(startX: number, startY: number): Player;
export declare function getPlayerKey(player: Player): string;
export declare function movePlayer(player: Player, dx: number, dy: number): boolean;
export declare function drawCellOnMap(player: Player, x: number, y: number, type: number): boolean;
