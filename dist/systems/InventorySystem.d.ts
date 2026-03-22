export declare enum ItemType {
    PENCIL = "pencil",
    QUILL = "quill",
    INK = "ink",
    SURVEYOR = "surveyor",
    TORCH = "torch",
    LANTERN = "lantern",
    GLOWSTONE = "glowstone",
    FOOD = "food",
    PAPER_ROUGH = "paper_rough",
    PAPER_PARCHMENT = "paper_parchment",
    PAPER_WATERPROOF = "paper_waterproof"
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
export declare const ITEM_DEFINITIONS: Record<ItemType, Item>;
export interface InventorySlot {
    item: ItemType;
    count: number;
    durability?: number;
}
export declare class InventorySystem {
    private readonly MAX_SLOTS;
    private slots;
    constructor();
    addItem(itemType: ItemType, count?: number): boolean;
    removeItem(itemType: ItemType, count?: number): boolean;
    hasItem(itemType: ItemType, count?: number): boolean;
    getItemCount(itemType: ItemType): number;
    getSlots(): (InventorySlot | null)[];
    getUsedSlots(): number;
    getFreeSlots(): number;
}
