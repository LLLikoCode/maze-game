export type InputCallback = (action: string) => void;

export class InputHandler {
    private callbacks: Map<string, InputCallback[]>;
    private keysPressed: Set<string>;
    
    constructor() {
        this.callbacks = new Map();
        this.keysPressed = new Set();
        this.setupEventListeners();
    }
    
    private setupEventListeners(): void {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            
            if (!this.keysPressed.has(key)) {
                this.keysPressed.add(key);
                this.handleKeyDown(key);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keysPressed.delete(key);
        });
    }
    
    private handleKeyDown(key: string): void {
        const actionMap: Record<string, string> = {
            'w': 'move_up',
            'arrowup': 'move_up',
            's': 'move_down',
            'arrowdown': 'move_down',
            'a': 'move_left',
            'arrowleft': 'move_left',
            'd': 'move_right',
            'arrowright': 'move_right',
            ' ': 'draw_map',
            'r': 'regenerate',
            'u': 'go_up',
            'j': 'go_down',
            '1': 'equip_torch',
            '2': 'equip_lantern',
        };
        
        const action = actionMap[key];
        if (action) {
            this.trigger(action);
        }
    }
    
    on(action: string, callback: InputCallback): void {
        if (!this.callbacks.has(action)) {
            this.callbacks.set(action, []);
        }
        this.callbacks.get(action)!.push(callback);
    }
    
    off(action: string, callback: InputCallback): void {
        const callbacks = this.callbacks.get(action);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    private trigger(action: string): void {
        const callbacks = this.callbacks.get(action);
        if (callbacks) {
            for (const callback of callbacks) {
                callback(action);
            }
        }
    }
}
