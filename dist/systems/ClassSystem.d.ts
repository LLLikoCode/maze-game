import { Player } from '../core/Player.js';
export declare enum PlayerClass {
    SURVEYOR = "surveyor",
    EXPLORER = "explorer",
    ARCHAEOLOGIST = "archaeologist",
    SURVIVALIST = "survivalist",
    COURIER = "courier"
}
export interface ClassData {
    type: PlayerClass;
    name: string;
    description: string;
    visionBonus: number;
    staminaBonus: number;
    drawAccuracyBonus: number;
    moveSpeedBonus: number;
    specialAbility: string;
    startingItems: string[];
}
export declare const CLASS_DEFINITIONS: Record<PlayerClass, ClassData>;
export declare class ClassSystem {
    private currentClass;
    selectClass(playerClass: PlayerClass): void;
    getCurrentClass(): PlayerClass;
    getClassData(playerClass: PlayerClass): ClassData;
    getCurrentClassData(): ClassData;
    applyClassBonuses(player: Player): void;
    getAllClasses(): ClassData[];
}
