export var PlayerClass;
(function (PlayerClass) {
    PlayerClass["SURVEYOR"] = "surveyor";
    PlayerClass["EXPLORER"] = "explorer";
    PlayerClass["ARCHAEOLOGIST"] = "archaeologist";
    PlayerClass["SURVIVALIST"] = "survivalist";
    PlayerClass["COURIER"] = "courier";
})(PlayerClass || (PlayerClass = {}));
export const CLASS_DEFINITIONS = {
    [PlayerClass.SURVEYOR]: {
        type: PlayerClass.SURVEYOR,
        name: '测绘师',
        description: '精通地图绘制的专家',
        visionBonus: 0,
        staminaBonus: 0,
        drawAccuracyBonus: 0.3, // +30% 绘图精度
        moveSpeedBonus: 0,
        specialAbility: '绘图精度+30%，可发现隐藏通道',
        startingItems: ['surveyor', 'paper_parchment', 'paper_parchment'],
    },
    [PlayerClass.EXPLORER]: {
        type: PlayerClass.EXPLORER,
        name: '探险家',
        description: '善于探索未知的冒险者',
        visionBonus: 2, // +2 视野
        staminaBonus: 20,
        drawAccuracyBonus: 0,
        moveSpeedBonus: 0.2, // +20% 移动速度
        specialAbility: '视野+2，移动速度+20%',
        startingItems: ['torch', 'torch', 'lantern'],
    },
    [PlayerClass.ARCHAEOLOGIST]: {
        type: PlayerClass.ARCHAEOLOGIST,
        name: '考古学家',
        description: '解读古代遗迹的学者',
        visionBonus: 0,
        staminaBonus: 0,
        drawAccuracyBonus: 0.1,
        moveSpeedBonus: 0,
        specialAbility: '可解读古代符号，发现隐藏门概率x2',
        startingItems: ['pencil', 'paper_parchment', 'paper_parchment', 'paper_parchment'],
    },
    [PlayerClass.SURVIVALIST]: {
        type: PlayerClass.SURVIVALIST,
        name: '生存专家',
        description: '在恶劣环境中求生的专家',
        visionBonus: 0,
        staminaBonus: 30,
        drawAccuracyBonus: 0,
        moveSpeedBonus: 0,
        specialAbility: '体力消耗-20%，压力积累-30%',
        startingItems: ['food', 'food', 'food', 'torch', 'torch'],
    },
    [PlayerClass.COURIER]: {
        type: PlayerClass.COURIER,
        name: '信使',
        description: '快速传递信息的使者',
        visionBonus: 1,
        staminaBonus: 10,
        drawAccuracyBonus: 0,
        moveSpeedBonus: 0.3, // +30% 移动速度
        specialAbility: '移动速度+30%，适合多人合作',
        startingItems: ['pencil', 'paper_parchment', 'paper_parchment', 'torch'],
    },
};
export class ClassSystem {
    constructor() {
        this.currentClass = PlayerClass.EXPLORER;
    }
    selectClass(playerClass) {
        this.currentClass = playerClass;
    }
    getCurrentClass() {
        return this.currentClass;
    }
    getClassData(playerClass) {
        return CLASS_DEFINITIONS[playerClass];
    }
    getCurrentClassData() {
        return CLASS_DEFINITIONS[this.currentClass];
    }
    applyClassBonuses(player) {
        const classData = this.getCurrentClassData();
        // 应用属性加成
        player.visionRadius += classData.visionBonus;
        player.maxStamina += classData.staminaBonus;
        player.stamina = player.maxStamina;
    }
    getAllClasses() {
        return Object.values(CLASS_DEFINITIONS);
    }
}
//# sourceMappingURL=ClassSystem.js.map