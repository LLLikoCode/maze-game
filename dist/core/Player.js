export function createPlayer(startX, startY) {
    return {
        x: startX,
        y: startY,
        layer: 1,
        stamina: 100,
        maxStamina: 100,
        visionRadius: 3,
        paper: 5,
        pencilDurability: 100,
        torches: 3,
        drawnCells: new Map(),
    };
}
export function getPlayerKey(player) {
    return `${player.x},${player.y}`;
}
export function movePlayer(player, dx, dy) {
    player.x += dx;
    player.y += dy;
    // 移动消耗体力
    player.stamina = Math.max(0, player.stamina - 1);
    return true;
}
export function drawCellOnMap(player, x, y, type) {
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
//# sourceMappingURL=Player.js.map