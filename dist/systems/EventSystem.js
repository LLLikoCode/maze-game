export var EventType;
(function (EventType) {
    EventType["DISCOVERY"] = "discovery";
    EventType["CHALLENGE"] = "challenge";
    EventType["NARRATIVE"] = "narrative";
    EventType["ENVIRONMENT"] = "environment";
})(EventType || (EventType = {}));
export class EventSystem {
    constructor() {
        this.events = new Map();
        this.eventHistory = [];
        this.maxHistory = 20;
        this.initializeEvents();
    }
    initializeEvents() {
        // 发现类事件
        this.addEvent({
            id: 'hidden_door',
            type: EventType.DISCOVERY,
            name: '隐藏的门',
            description: '你发现墙壁上有一道细微的缝隙，似乎是一扇隐藏的门。',
            condition: 'map_completion > 30',
            probability: 0.1,
            choices: [
                {
                    id: 'open',
                    text: '尝试打开',
                    consequence: '可能发现捷径或触发陷阱',
                    reward: 'shortcut_or_treasure',
                    risk: 'trap_damage',
                },
                {
                    id: 'mark',
                    text: '标记位置，继续前进',
                    consequence: '安全但可能错过机会',
                },
                {
                    id: 'ignore',
                    text: '忽略',
                    consequence: '什么也没有发生',
                },
            ],
        });
        this.addEvent({
            id: 'ancient_markings',
            type: EventType.DISCOVERY,
            name: '古老的符号',
            description: '墙壁上刻着奇怪的古代符号。',
            condition: 'player.class == ARCHAEOLOGIST',
            probability: 0.15,
            choices: [
                {
                    id: 'decipher',
                    text: '尝试解读',
                    consequence: '可能获得有用信息',
                    reward: 'hint_or_warning',
                },
                {
                    id: 'ignore',
                    text: '忽略',
                    consequence: '继续前进',
                },
            ],
        });
        // 挑战类事件
        this.addEvent({
            id: 'timed_mapping',
            type: EventType.CHALLENGE,
            name: '限时绘制',
            description: '你感觉到迷宫的结构在变化，必须在时间内完成绘制！',
            condition: 'stamina > 50',
            probability: 0.08,
            choices: [
                {
                    id: 'accept',
                    text: '接受挑战',
                    consequence: '60秒内绘制当前区域',
                    reward: 'bonus_exp',
                    risk: 'partial_map_loss',
                },
                {
                    id: 'decline',
                    text: '放弃',
                    consequence: '安全但无奖励',
                },
            ],
        });
        this.addEvent({
            id: 'fog_rolls_in',
            type: EventType.ENVIRONMENT,
            name: '迷雾降临',
            description: '浓雾突然笼罩了迷宫，视野受到限制。',
            condition: 'weather == FOGGY',
            probability: 0.05,
            choices: [
                {
                    id: 'wait',
                    text: '等待迷雾散去',
                    consequence: '时间流逝，视野恢复',
                },
                {
                    id: 'push_through',
                    text: '强行前进',
                    consequence: '视野-50%，风险增加',
                    risk: 'get_lost',
                },
            ],
        });
        // 叙事类事件
        this.addEvent({
            id: 'diary_fragment',
            type: EventType.NARRATIVE,
            name: '日记残页',
            description: '地上散落着一张泛黄的纸，似乎是前人的日记。',
            condition: 'random < 0.1',
            probability: 0.1,
            choices: [
                {
                    id: 'read',
                    text: '阅读',
                    consequence: '了解迷宫的历史',
                    reward: 'lore_piece',
                },
                {
                    id: 'take',
                    text: '收起来',
                    consequence: '获得日记残页',
                    reward: 'diary_item',
                },
            ],
        });
        this.addEvent({
            id: 'ghostly_apparition',
            type: EventType.NARRATIVE,
            name: '幽灵幻象',
            description: '你看到一个模糊的身影在前方飘过...',
            condition: 'pressure > 70',
            probability: 0.05,
            choices: [
                {
                    id: 'follow',
                    text: '跟随',
                    consequence: '可能发现秘密，也可能陷入危险',
                    reward: 'secret_location',
                    risk: 'pressure_increase',
                },
                {
                    id: 'ignore',
                    text: '忽略',
                    consequence: '幻象消失了',
                },
            ],
        });
    }
    addEvent(event) {
        this.events.set(event.id, event);
    }
    // 根据条件触发事件
    triggerEvent(playerState) {
        const candidates = [];
        for (const event of this.events.values()) {
            // 检查概率
            if (Math.random() > event.probability) {
                continue;
            }
            // 检查条件
            if (this.checkCondition(event.condition, playerState)) {
                candidates.push(event);
            }
        }
        if (candidates.length === 0) {
            return null;
        }
        // 随机选择一个事件
        const selected = candidates[Math.floor(Math.random() * candidates.length)];
        // 记录历史
        this.eventHistory.push(selected.id);
        if (this.eventHistory.length > this.maxHistory) {
            this.eventHistory.shift();
        }
        return selected;
    }
    checkCondition(condition, playerState) {
        // 简化条件检查
        if (condition === 'random < 0.1') {
            return Math.random() < 0.1;
        }
        // 解析简单条件
        const parts = condition.split(' ');
        if (parts.length === 3) {
            const [key, operator, value] = parts;
            const playerValue = playerState[key];
            if (playerValue === undefined) {
                return false;
            }
            switch (operator) {
                case '>':
                    return playerValue > parseFloat(value);
                case '<':
                    return playerValue < parseFloat(value);
                case '==':
                    return playerValue === value;
                case '>=':
                    return playerValue >= parseFloat(value);
                case '<=':
                    return playerValue <= parseFloat(value);
            }
        }
        return true;
    }
    getEvent(id) {
        return this.events.get(id);
    }
    getAllEvents() {
        return Array.from(this.events.values());
    }
    getEventsByType(type) {
        return this.getAllEvents().filter(e => e.type === type);
    }
    getEventHistory() {
        return [...this.eventHistory];
    }
    // 处理玩家选择
    processChoice(eventId, choiceId) {
        const event = this.events.get(eventId);
        if (!event) {
            return { success: false, message: '事件不存在' };
        }
        const choice = event.choices.find(c => c.id === choiceId);
        if (!choice) {
            return { success: false, message: '选择不存在' };
        }
        return {
            success: true,
            message: choice.consequence,
            rewards: choice.reward ? [choice.reward] : undefined,
            risks: choice.risk ? [choice.risk] : undefined,
        };
    }
}
//# sourceMappingURL=EventSystem.js.map