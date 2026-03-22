import { Player } from '../core/Player.js';

export enum MarkType {
    DANGER = 'danger',
    TREASURE = 'treasure',
    DOOR = 'door',
    MONSTER = 'monster',
    UNKNOWN = 'unknown',
    CLEARED = 'cleared',
    LOOP = 'loop',
    STAIRS_UP = 'stairs_up',
    STAIRS_DOWN = 'stairs_down',
    CUSTOM = 'custom',
}

export interface MapMark {
    x: number;
    y: number;
    type: MarkType;
    customText?: string;
    timestamp: number;
}

export const MARK_SYMBOLS: Record<MarkType, string> = {
    [MarkType.DANGER]: '⚠️',
    [MarkType.TREASURE]: '💰',
    [MarkType.DOOR]: '🚪',
    [MarkType.MONSTER]: '💀',
    [MarkType.UNKNOWN]: '❓',
    [MarkType.CLEARED]: '✓',
    [MarkType.LOOP]: '🔄',
    [MarkType.STAIRS_UP]: '⬆️',
    [MarkType.STAIRS_DOWN]: '⬇️',
    [MarkType.CUSTOM]: '📝',
};

export const MARK_NAMES: Record<MarkType, string> = {
    [MarkType.DANGER]: '危险',
    [MarkType.TREASURE]: '宝藏',
    [MarkType.DOOR]: '门/通道',
    [MarkType.MONSTER]: '怪物',
    [MarkType.UNKNOWN]: '未探索',
    [MarkType.CLEARED]: '已清理',
    [MarkType.LOOP]: '循环陷阱',
    [MarkType.STAIRS_UP]: '通往上层',
    [MarkType.STAIRS_DOWN]: '通往下层',
    [MarkType.CUSTOM]: '自定义',
};

export class MarkSystem {
    private marks: Map<string, MapMark> = new Map();
    private maxMarks: number = 50; // 最大标记数量
    
    addMark(x: number, y: number, type: MarkType, customText?: string): boolean {
        const key = `${x},${y}`;
        
        // 检查是否超过最大标记数
        if (this.marks.size >= this.maxMarks && !this.marks.has(key)) {
            return false;
        }
        
        this.marks.set(key, {
            x,
            y,
            type,
            customText,
            timestamp: Date.now(),
        });
        
        return true;
    }
    
    removeMark(x: number, y: number): boolean {
        const key = `${x},${y}`;
        return this.marks.delete(key);
    }
    
    getMark(x: number, y: number): MapMark | undefined {
        const key = `${x},${y}`;
        return this.marks.get(key);
    }
    
    hasMark(x: number, y: number): boolean {
        const key = `${x},${y}`;
        return this.marks.has(key);
    }
    
    getAllMarks(): MapMark[] {
        return Array.from(this.marks.values());
    }
    
    getMarksByType(type: MarkType): MapMark[] {
        return this.getAllMarks().filter(mark => mark.type === type);
    }
    
    clearAllMarks(): void {
        this.marks.clear();
    }
    
    getMarkCount(): number {
        return this.marks.size;
    }
    
    // 快捷添加方法
    markDanger(x: number, y: number): boolean {
        return this.addMark(x, y, MarkType.DANGER);
    }
    
    markTreasure(x: number, y: number): boolean {
        return this.addMark(x, y, MarkType.TREASURE);
    }
    
    markStairsUp(x: number, y: number): boolean {
        return this.addMark(x, y, MarkType.STAIRS_UP);
    }
    
    markStairsDown(x: number, y: number): boolean {
        return this.addMark(x, y, MarkType.STAIRS_DOWN);
    }
    
    markCustom(x: number, y: number, text: string): boolean {
        return this.addMark(x, y, MarkType.CUSTOM, text);
    }
}
