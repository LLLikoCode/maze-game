export class InputHandler {
    constructor() {
        this.callbacks = new Map();
        this.keysPressed = new Set();
        this.setupEventListeners();
    }
    setupEventListeners() {
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
    handleKeyDown(key) {
        const actionMap = {
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
            'q': 'mark_danger',
            'e': 'mark_treasure',
            't': 'mark_stairs_up',
            'g': 'mark_stairs_down',
            'f5': 'save_game',
            'l': 'load_game',
            '6': 'class_surveyor',
            '7': 'class_explorer',
            '8': 'class_archaeologist',
            '9': 'class_survivalist',
            '0': 'class_courier',
            'c': 'show_achievements',
        };
        const action = actionMap[key];
        if (action) {
            this.trigger(action);
        }
    }
    on(action, callback) {
        if (!this.callbacks.has(action)) {
            this.callbacks.set(action, []);
        }
        this.callbacks.get(action).push(callback);
    }
    off(action, callback) {
        const callbacks = this.callbacks.get(action);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    trigger(action) {
        const callbacks = this.callbacks.get(action);
        if (callbacks) {
            for (const callback of callbacks) {
                callback(action);
            }
        }
    }
}
//# sourceMappingURL=InputHandler.js.map