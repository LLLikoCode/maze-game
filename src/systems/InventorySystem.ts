import { Player } from '../core/Player.js';

export enum ItemType {
    PENCIL = 'pencil',
    QUILL = 'quill',
    INK = 'ink',
    SURVEYOR = 'surveyor',
    TORCH = 'torch',
    LANTERN = 'lantern',
    GLOWSTONE = 'glowstone',
    FOOD = 'food',
    PAPER_ROUGH = 'paper_rough',
    PAPER_PARCHMENT = 'paper_parchment',
    PAPER_WATERPROOF = 'paper_waterproof',
}

export interface Item {
    type: ItemType;
    name: string;
    description: string;
    stackable: boolean;
    maxStack: number;
    durability?: number;
    maxDurability?: number;
}

export const ITEM_DEFINITIONS: Record<ItemType, Item> = {
    [ItemType.PENCIL]: {
        type: ItemType.PENCIL,
        name: '探险者铅笔',
        description: '可擦除修改，精度一般',
        stackable: false,
        maxStack: 1,
        maxDurability: 100,
    },
    [ItemType.QUILL]: {
        type: ItemType.QUILL,
        name: '学者羽毛笔',
        description: '永久记录，高精度',
        stackable: false,
        maxStack: 1,
        maxDurability: 50,
    },
    [ItemType.INK]: {
        type: ItemType.INK,
        name: '墨水',
        description: '配合羽毛笔使用',
        stackable: true,
        maxStack: 5,
    },
    [ItemType.SURVEYOR]: {
        type: ItemType.SURVEYOR,
        name: '精密测绘仪',
        description: '极高精度，但使用缓慢',
        stackable: false,
        maxStack: 1,
    },
    [ItemType.TORCH]: {
        type: ItemType.TORCH,
        name: '火把',
        description: '提供光源，持续10分钟',
        stackable: true,
        maxStack: 5,
    },
    [ItemType.LANTERN]: {
        type: ItemType.LANTERN,
        name: '提灯',
        description: '稳定光源，持续30分钟',
        stackable: false,
        maxStack: 1,
    },
    [ItemType.GLOWSTONE]: {
        type: ItemType.GLOWSTONE,
        name: '荧光石',
        description: '微弱但永久的光源',
        stackable: true,
        maxStack: 3,
    },
    [ItemType.FOOD]: {
        type: ItemType.FOOD,
        name: '干粮',
        description: '恢复20点体力',
        stackable: true,
        maxStack: 10,
    },
    [ItemType.PAPER_ROUGH]: {
        type: ItemType.PAPER_ROUGH,
        name: '粗糙纸张',
        description: '遇水即毁，20x20格',
        stackable: true,
        maxStack: 5,
    },
    [ItemType.PAPER_PARCHMENT]: {
        type: ItemType.PAPER_PARCHMENT,
        name: '羊皮纸',
        description: '标准纸张，30x30格',
        stackable: true,
        maxStack: 5,
    },
    [ItemType.PAPER_WATERPROOF]: {
        type: ItemType.PAPER_WATERPROOF,
        name: '防水纸',
        description: '防水，25x25格',
        stackable: true,
        maxStack: 3,
    },
};

export interface InventorySlot {
    item: ItemType;
    count: number;
    durability?: number;
}

export class InventorySystem {
    private readonly MAX_SLOTS = 10;
    private slots: (InventorySlot | null)[];
    
    constructor() {
        this.slots = new Array(this.MAX_SLOTS).fill(null);
    }
    
    addItem(itemType: ItemType, count: number = 1): boolean {
        const definition = ITEM_DEFINITIONS[itemType];
        
        // 尝试堆叠
        if (definition.stackable) {
            for (const slot of this.slots) {
                if (slot && slot.item === itemType && slot.count < definition.maxStack) {
                    const canAdd = Math.min(count, definition.maxStack - slot.count);
                    slot.count += canAdd;
                    count -= canAdd;
                    
                    if (count <= 0) return true;
                }
            }
        }
        
        // 寻找空槽位
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i] === null) {
                this.slots[i] = {
                    item: itemType,
                    count: Math.min(count, definition.maxStack),
                    durability: definition.maxDurability,
                };
                return true;
            }
        }
        
        return false; // 背包已满
    }
    
    removeItem(itemType: ItemType, count: number = 1): boolean {
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            if (slot && slot.item === itemType) {
                if (slot.count >= count) {
                    slot.count -= count;
                    if (slot.count <= 0) {
                        this.slots[i] = null;
                    }
                    return true;
                }
            }
        }
        return false;
    }
    
    hasItem(itemType: ItemType, count: number = 1): boolean {
        let total = 0;
        for (const slot of this.slots) {
            if (slot && slot.item === itemType) {
                total += slot.count;
                if (total >= count) return true;
            }
        }
        return false;
    }
    
    getItemCount(itemType: ItemType): number {
        let total = 0;
        for (const slot of this.slots) {
            if (slot && slot.item === itemType) {
                total += slot.count;
            }
        }
        return total;
    }
    
    getSlots(): (InventorySlot | null)[] {
        return [...this.slots];
    }
    
    getUsedSlots(): number {
        return this.slots.filter(slot => slot !== null).length;
    }
    
    getFreeSlots(): number {
        return this.slots.filter(slot => slot === null).length;
    }
}
