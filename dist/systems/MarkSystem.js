export var MarkType;
(function (MarkType) {
    MarkType["DANGER"] = "danger";
    MarkType["TREASURE"] = "treasure";
    MarkType["DOOR"] = "door";
    MarkType["MONSTER"] = "monster";
    MarkType["UNKNOWN"] = "unknown";
    MarkType["CLEARED"] = "cleared";
    MarkType["LOOP"] = "loop";
    MarkType["STAIRS_UP"] = "stairs_up";
    MarkType["STAIRS_DOWN"] = "stairs_down";
    MarkType["CUSTOM"] = "custom";
})(MarkType || (MarkType = {}));
export const MARK_SYMBOLS = {
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
export const MARK_NAMES = {
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
    constructor() {
        this.marks = new Map();
        this.maxMarks = 50; // 最大标记数量
    }
    addMark(x, y, type, customText) {
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
    removeMark(x, y) {
        const key = `${x},${y}`;
        return this.marks.delete(key);
    }
    getMark(x, y) {
        const key = `${x},${y}`;
        return this.marks.get(key);
    }
    hasMark(x, y) {
        const key = `${x},${y}`;
        return this.marks.has(key);
    }
    getAllMarks() {
        return Array.from(this.marks.values());
    }
    getMarksByType(type) {
        return this.getAllMarks().filter(mark => mark.type === type);
    }
    clearAllMarks() {
        this.marks.clear();
    }
    getMarkCount() {
        return this.marks.size;
    }
    // 快捷添加方法
    markDanger(x, y) {
        return this.addMark(x, y, MarkType.DANGER);
    }
    markTreasure(x, y) {
        return this.addMark(x, y, MarkType.TREASURE);
    }
    markStairsUp(x, y) {
        return this.addMark(x, y, MarkType.STAIRS_UP);
    }
    markStairsDown(x, y) {
        return this.addMark(x, y, MarkType.STAIRS_DOWN);
    }
    markCustom(x, y, text) {
        return this.addMark(x, y, MarkType.CUSTOM, text);
    }
}
//# sourceMappingURL=MarkSystem.js.map