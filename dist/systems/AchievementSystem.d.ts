export declare enum AchievementType {
    EXPLORATION = "exploration",
    SKILL = "skill",
    COLLECTION = "collection"
}
export interface Achievement {
    id: string;
    type: AchievementType;
    name: string;
    description: string;
    condition: string;
    unlocked: boolean;
    unlockedAt?: number;
    reward?: string;
}
export declare class AchievementSystem {
    private achievements;
    private unlockedCount;
    constructor();
    private initializeAchievements;
    private addAchievement;
    unlockAchievement(id: string): boolean;
    isUnlocked(id: string): boolean;
    getAchievement(id: string): Achievement | undefined;
    getAllAchievements(): Achievement[];
    getUnlockedAchievements(): Achievement[];
    getLockedAchievements(): Achievement[];
    getAchievementsByType(type: AchievementType): Achievement[];
    getUnlockedCount(): number;
    getTotalCount(): number;
    getCompletionPercentage(): number;
    checkAndUnlock(condition: string): string[];
    exportAchievements(): string;
    importAchievements(json: string): void;
}
