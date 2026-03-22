export type InputCallback = (action: string) => void;
export declare class InputHandler {
    private callbacks;
    private keysPressed;
    constructor();
    private setupEventListeners;
    private handleKeyDown;
    on(action: string, callback: InputCallback): void;
    off(action: string, callback: InputCallback): void;
    private trigger;
}
