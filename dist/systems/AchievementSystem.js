export var AchievementType;
(function (AchievementType) {
    AchievementType["EXPLORATION"] = "exploration";
    AchievementType["SKILL"] = "skill";
    AchievementType["COLLECTION"] = "collection";
})(AchievementType || (AchievementType = {}));
export class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlockedCount = 0;
        this.initializeAchievements();
    }
    initializeAchievements() {
        // 探索类成就
        this.addAchievement({
            id: 'first_step',
            type: AchievementType.EXPLORATION,
            name: '初出茅庐',
            description: '完成第一层迷宫',
            condition: 'complete_layer_1',
            unlocked: false,
            reward: '解锁新职业',
        });
        this.addAchievement({
            id: 'abyss_walker',
            type: AchievementType.EXPLORATION,
            name: '深渊行者',
            description: '到达第4层',
            condition: 'reach_layer_4',
            unlocked: false,
            reward: '特殊称号',
        });
        this.addAchievement({
            id: 'perfect_mapper',
            type: AchievementType.EXPLORATION,
            name: '完美绘者',
            description: '地图完整度达到100%',
            condition: 'map_completion_100',
            unlocked: false,
        });
        this.addAchievement({
            id: 'speed_mapper',
            type: AchievementType.EXPLORATION,
            name: '速绘大师',
            description: '10分钟内完成一层',
            condition: 'complete_in_10min',
            unlocked: false,
        });
        // 技巧类成就
        this.addAchievement({
            id: 'eagle_eye',
            type: AchievementType.SKILL,
            name: '鹰眼',
            description: '发现10个隐藏门',
            condition: 'find_10_secrets',
            unlocked: false,
        });
        this.addAchievement({
            id: 'photographic_memory',
            type: AchievementType.SKILL,
            name: '过目不忘',
            description: '不回访任何区域完成一层',
            condition: 'no_revisit_complete',
            unlocked: false,
        });
        this.addAchievement({
            id: 'one_stroke',
            type: AchievementType.SKILL,
            name: '一笔成画',
            description: '只用羽毛笔完成一层',
            condition: 'complete_with_quill_only',
            unlocked: false,
        });
        this.addAchievement({
            id: 'dark_master',
            type: AchievementType.SKILL,
            name: '黑暗大师',
            description: '不使用光源完成一层',
            condition: 'complete_without_light',
            unlocked: false,
        });
        // 收集类成就
        this.addAchievement({
            id: 'cartographer',
            type: AchievementType.COLLECTION,
            name: '制图师',
            description: '收集所有古代地图碎片',
            condition: 'collect_all_fragments',
            unlocked: false,
        });
        this.addAchievement({
            id: 'tool_master',
            type: AchievementType.COLLECTION,
            name: '工具大师',
            description: '使用过所有类型的工具',
            condition: 'use_all_tools',
            unlocked: false,
        });
        this.addAchievement({
            id: 'treasure_hunter',
            type: AchievementType.COLLECTION,
            name: '宝藏猎人',
            description: '找到所有隐藏宝藏',
            condition: 'find_all_treasures',
            unlocked: false,
        });
    }
    addAchievement(achievement) {
        this.achievements.set(achievement.id, achievement);
    }
    unlockAchievement(id) {
        const achievement = this.achievements.get(id);
        if (!achievement || achievement.unlocked) {
            return false;
        }
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        this.unlockedCount++;
        return true;
    }
    isUnlocked(id) {
        const achievement = this.achievements.get(id);
        return achievement?.unlocked || false;
    }
    getAchievement(id) {
        return this.achievements.get(id);
    }
    getAllAchievements() {
        return Array.from(this.achievements.values());
    }
    getUnlockedAchievements() {
        return this.getAllAchievements().filter(a => a.unlocked);
    }
    getLockedAchievements() {
        return this.getAllAchievements().filter(a => !a.unlocked);
    }
    getAchievementsByType(type) {
        return this.getAllAchievements().filter(a => a.type === type);
    }
    getUnlockedCount() {
        return this.unlockedCount;
    }
    getTotalCount() {
        return this.achievements.size;
    }
    getCompletionPercentage() {
        return Math.floor((this.unlockedCount / this.achievements.size) * 100);
    }
    // 检查条件并解锁
    checkAndUnlock(condition) {
        const unlocked = [];
        for (const [id, achievement] of this.achievements) {
            if (!achievement.unlocked && achievement.condition === condition) {
                if (this.unlockAchievement(id)) {
                    unlocked.push(achievement.name);
                }
            }
        }
        return unlocked;
    }
    // 导出成就数据
    exportAchievements() {
        const data = {
            unlocked: this.getUnlockedAchievements().map(a => a.id),
            timestamp: Date.now(),
        };
        return JSON.stringify(data);
    }
    // 导入成就数据
    importAchievements(json) {
        try {
            const data = JSON.parse(json);
            if (data.unlocked && Array.isArray(data.unlocked)) {
                for (const id of data.unlocked) {
                    this.unlockAchievement(id);
                }
            }
        }
        catch (e) {
            console.error('导入成就失败:', e);
        }
    }
}
//# sourceMappingURL=AchievementSystem.js.map