export declare enum EventType {
    DISCOVERY = "discovery",
    CHALLENGE = "challenge",
    NARRATIVE = "narrative",
    ENVIRONMENT = "environment"
}
export interface GameEvent {
    id: string;
    type: EventType;
    name: string;
    description: string;
    condition: string;
    probability: number;
    choices: EventChoice[];
}
export interface EventChoice {
    id: string;
    text: string;
    consequence: string;
    reward?: string;
    risk?: string;
}
export declare class EventSystem {
    private events;
    private eventHistory;
    private maxHistory;
    constructor();
    private initializeEvents;
    private addEvent;
    triggerEvent(playerState: Record<string, any>): GameEvent | null;
    private checkCondition;
    getEvent(id: string): GameEvent | undefined;
    getAllEvents(): GameEvent[];
    getEventsByType(type: EventType): GameEvent[];
    getEventHistory(): string[];
    processChoice(eventId: string, choiceId: string): {
        success: boolean;
        message: string;
        rewards?: string[];
        risks?: string[];
    };
}
