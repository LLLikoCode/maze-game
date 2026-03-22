export declare enum MarkType {
    DANGER = "danger",
    TREASURE = "treasure",
    DOOR = "door",
    MONSTER = "monster",
    UNKNOWN = "unknown",
    CLEARED = "cleared",
    LOOP = "loop",
    STAIRS_UP = "stairs_up",
    STAIRS_DOWN = "stairs_down",
    CUSTOM = "custom"
}
export interface MapMark {
    x: number;
    y: number;
    type: MarkType;
    customText?: string;
    timestamp: number;
}
export declare const MARK_SYMBOLS: Record<MarkType, string>;
export declare const MARK_NAMES: Record<MarkType, string>;
export declare class MarkSystem {
    private marks;
    private maxMarks;
    addMark(x: number, y: number, type: MarkType, customText?: string): boolean;
    removeMark(x: number, y: number): boolean;
    getMark(x: number, y: number): MapMark | undefined;
    hasMark(x: number, y: number): boolean;
    getAllMarks(): MapMark[];
    getMarksByType(type: MarkType): MapMark[];
    clearAllMarks(): void;
    getMarkCount(): number;
    markDanger(x: number, y: number): boolean;
    markTreasure(x: number, y: number): boolean;
    markStairsUp(x: number, y: number): boolean;
    markStairsDown(x: number, y: number): boolean;
    markCustom(x: number, y: number, text: string): boolean;
}
