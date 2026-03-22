import { Point } from './Maze.js';
import { InventorySystem, ItemType } from '../systems/InventorySystem.js';

export interface Player {
    x: number;
    y: number;
    layer: number;
    stamina: number;
    maxStamina: number;
    visionRadius: number;
    
    // 背包系统
    inventory: InventorySystem;
    
    // 旧版兼容（逐步迁移）
    paper: number;
    pencilDurability: number;
    torches: number;
    
    // 地图绘制
    drawnCells: Map<string, DrawnCell>;
    
    // 当前装备的光源
    equippedLight: string | null;
}

export interface DrawnCell {
    x: number;
    y: number;
    type: number;
    accuracy: number;
    timestamp: number;
}

export function createPlayer(startX: number, startY: number): Player {
    const inventory = new InventorySystem();
    
    // 初始装备
    inventory.addItem(ItemType.PENCIL, 1);
    inventory.addItem(ItemType.TORCH, 3);
    inventory.addItem(ItemType.PAPER_PARCHMENT, 3);
    inventory.addItem(ItemType.FOOD, 2);
    
    return {
        x: startX,
        y: startY,
        layer: 1,
        stamina: 100,
        maxStamina: 100,
        visionRadius: 3,
        inventory,
        paper: 5,
        pencilDurability: 100,
        torches: 3,
        drawnCells: new Map(),
        equippedLight: null,
    };
}

export function getPlayerKey(player: Player): string {
    return `${player.x},${player.y}`;
}

export function movePlayer(player: Player, dx: number, dy: number): boolean {
    player.x += dx;
    player.y += dy;
    
    // 移动消耗体力
    player.stamina = Math.max(0, player.stamina - 1);
    
    return true;
}

export function drawCellOnMap(player: Player, x: number, y: number, type: number): boolean {
    if (player.pencilDurability <= 0) {
        return false;
    }
    
    const key = `${x},${y}`;
    const existing = player.drawnCells.get(key);
    
    // 计算准确度（简单版本：95%准确）
    const accuracy = 0.95;
    
    player.drawnCells.set(key, {
        x,
        y,
        type,
        accuracy,
        timestamp: Date.now(),
    });
    
    // 消耗铅笔耐久
    player.pencilDurability = Math.max(0, player.pencilDurability - 1);
    
    return true;
}
