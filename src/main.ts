import { MazeGenerator } from './generation/MazeGenerator.js';
import { Maze, CellType } from './core/Maze.js';
import { createPlayer, movePlayer, drawCellOnMap } from './core/Player.js';
import { Player } from './core/Player.js';
import { GameState } from './core/GameState.js';
import { VisionSystem } from './systems/VisionSystem.js';
import { LightSystem, LightSourceType } from './systems/LightSystem.js';
import { MemorySystem } from './systems/MemorySystem.js';
import { MarkSystem, MarkType } from './systems/MarkSystem.js';
import { SaveSystem } from './systems/SaveSystem.js';
import { ClassSystem, PlayerClass } from './systems/ClassSystem.js';
import { AchievementSystem } from './systems/AchievementSystem.js';
import { EventSystem } from './systems/EventSystem.js';
import { MazeRenderer } from './rendering/MazeRenderer.js';
import { MapRenderer } from './rendering/MapRenderer.js';
import { InputHandler } from './input/InputHandler.js';

class Game {
    private maze!: Maze;
    private player!: Player;
    private gameState: GameState;
    private visionSystem: VisionSystem;
    private lightSystem: LightSystem;
    private memorySystem: MemorySystem;
    private markSystem: MarkSystem;
    private saveSystem: SaveSystem;
    private classSystem: ClassSystem;
    private achievementSystem: AchievementSystem;
    private eventSystem: EventSystem;
    private mazeRenderer: MazeRenderer;
    private mapRenderer: MapRenderer;
    private inputHandler: InputHandler;
    
    private mazeCanvas: HTMLCanvasElement;
    private mapCanvas: HTMLCanvasElement;
    private messageLog: HTMLElement;
    
    private lastUpdateTime: number = Date.now();
    private currentMarkType: MarkType = MarkType.DANGER;
    
    constructor() {
        // 获取Canvas元素
        this.mazeCanvas = document.getElementById('maze-canvas') as HTMLCanvasElement;
        this.mapCanvas = document.getElementById('map-canvas') as HTMLCanvasElement;
        this.messageLog = document.getElementById('message-log') as HTMLElement;
        
        // 初始化系统
        this.gameState = new GameState();
        this.visionSystem = new VisionSystem();
        this.lightSystem = new LightSystem();
        this.memorySystem = new MemorySystem();
        this.markSystem = new MarkSystem();
        this.saveSystem = new SaveSystem();
        this.classSystem = new ClassSystem();
        this.achievementSystem = new AchievementSystem();
        this.eventSystem = new EventSystem();
        this.mazeRenderer = new MazeRenderer(this.mazeCanvas, 16);
        this.mapRenderer = new MapRenderer(this.mapCanvas);
        this.inputHandler = new InputHandler();
        
        // 显示职业选择
        this.showClassSelection();
        
        // 尝试加载存档
        this.tryLoadSave();
        
        // 启动游戏循环
        this.startGameLoop();
        
        // 启动自动保存
        this.saveSystem.autoSave(this.player, this.gameState);
        
        // 生成迷宫
        this.generateNewMaze();
        
        // 设置输入监听
        this.setupInput();
        
        // 初始渲染
        this.render();
        
        this.log('游戏初始化完成', 'important');
    }
    
    private generateNewMaze(layer: number = 1): void {
        const config = this.gameState.getLayerConfig(layer);
        const generator = new MazeGenerator(config.width, config.height);
        this.maze = generator.generate();
        this.maze.layer = layer;
        
        // 保存当前层数据
        this.gameState.setLayerData(layer, {
            layer,
            maze: this.maze,
            isGenerated: true,
        });
        
        // 如果是第一层，创建玩家
        if (layer === 1) {
            this.player = createPlayer(this.maze.entrance.x, this.maze.entrance.y);
        }
        
        this.gameState.setCurrentLayer(layer);
        this.player.layer = layer;
        
        // 更新视野
        this.visionSystem.updateVisibility(this.maze, this.player);
        
        this.log(`进入${this.gameState.getLayerName(layer)}`, 'important');
        this.log(this.gameState.getLayerDescription(layer));
        if (this.maze.stairsUp) {
            this.log(`上楼楼梯: (${this.maze.stairsUp.x}, ${this.maze.stairsUp.y})`);
        }
        if (this.maze.stairsDown) {
            this.log(`下楼楼梯: (${this.maze.stairsDown.x}, ${this.maze.stairsDown.y})`);
        }
    }
    
    private goUp(): void {
        const currentLayer = this.gameState.getCurrentLayer();
        if (!this.gameState.canGoUp(currentLayer)) {
            this.log('已经是最上层了', 'danger');
            return;
        }
        
        // 检查是否在楼梯上
        if (!this.maze.stairsUp || 
            this.player.x !== this.maze.stairsUp.x || 
            this.player.y !== this.maze.stairsUp.y) {
            this.log('不在上楼楼梯上', 'danger');
            return;
        }
        
        const upperLayer = currentLayer - 1;
        
        // 检查上层是否已生成
        if (this.gameState.hasLayerGenerated(upperLayer)) {
            const layerData = this.gameState.getLayerData(upperLayer)!;
            this.maze = layerData.maze;
        } else {
            this.generateNewMaze(upperLayer);
            return;
        }
        
        this.gameState.setCurrentLayer(upperLayer);
        this.player.layer = upperLayer;
        
        // 将玩家放在下楼楼梯位置
        if (this.maze.stairsDown) {
            this.player.x = this.maze.stairsDown.x;
            this.player.y = this.maze.stairsDown.y;
        }
        
        this.visionSystem.updateVisibility(this.maze, this.player);
        this.log(`进入${this.gameState.getLayerName(upperLayer)}`, 'important');
        this.updateUI();
        this.render();
    }
    
    private goDown(): void {
        const currentLayer = this.gameState.getCurrentLayer();
        if (!this.gameState.canGoDown(currentLayer)) {
            this.log('已经是最深层了', 'danger');
            return;
        }
        
        // 检查是否在楼梯上
        if (!this.maze.stairsDown || 
            this.player.x !== this.maze.stairsDown.x || 
            this.player.y !== this.maze.stairsDown.y) {
            this.log('不在下楼楼梯上', 'danger');
            return;
        }
        
        const lowerLayer = currentLayer + 1;
        
        // 检查下层是否已生成
        if (this.gameState.hasLayerGenerated(lowerLayer)) {
            const layerData = this.gameState.getLayerData(lowerLayer)!;
            this.maze = layerData.maze;
        } else {
            this.generateNewMaze(lowerLayer);
            return;
        }
        
        this.gameState.setCurrentLayer(lowerLayer);
        this.player.layer = lowerLayer;
        
        // 将玩家放在上楼楼梯位置
        if (this.maze.stairsUp) {
            this.player.x = this.maze.stairsUp.x;
            this.player.y = this.maze.stairsUp.y;
        }
        
        this.visionSystem.updateVisibility(this.maze, this.player);
        this.log(`进入${this.gameState.getLayerName(lowerLayer)}`, 'important');
        this.updateUI();
        this.render();
    }
    
    private setupInput(): void {
        this.inputHandler.on('move_up', () => this.move(0, -1));
        this.inputHandler.on('move_down', () => this.move(0, 1));
        this.inputHandler.on('move_left', () => this.move(-1, 0));
        this.inputHandler.on('move_right', () => this.move(1, 0));
        this.inputHandler.on('draw_map', () => this.drawMap());
        this.inputHandler.on('regenerate', () => this.regenerate());
        this.inputHandler.on('go_up', () => this.goUp());
        this.inputHandler.on('go_down', () => this.goDown());
        
        // 光源快捷键
        this.inputHandler.on('equip_torch', () => this.equipLight(LightSourceType.TORCH));
        this.inputHandler.on('equip_lantern', () => this.equipLight(LightSourceType.LANTERN));
        
        // 标记快捷键
        this.inputHandler.on('mark_danger', () => this.placeMark(MarkType.DANGER));
        this.inputHandler.on('mark_treasure', () => this.placeMark(MarkType.TREASURE));
        this.inputHandler.on('mark_stairs_up', () => this.placeMark(MarkType.STAIRS_UP));
        this.inputHandler.on('mark_stairs_down', () => this.placeMark(MarkType.STAIRS_DOWN));
        
        // 存档快捷键
        this.inputHandler.on('save_game', () => this.saveGame());
        this.inputHandler.on('load_game', () => this.loadGame());
        
        // 职业选择快捷键
        this.inputHandler.on('class_surveyor', () => this.selectClass(PlayerClass.SURVEYOR));
        this.inputHandler.on('class_explorer', () => this.selectClass(PlayerClass.EXPLORER));
        this.inputHandler.on('class_archaeologist', () => this.selectClass(PlayerClass.ARCHAEOLOGIST));
        this.inputHandler.on('class_survivalist', () => this.selectClass(PlayerClass.SURVIVALIST));
        this.inputHandler.on('class_courier', () => this.selectClass(PlayerClass.COURIER));
        
        // 成就查看
        this.inputHandler.on('show_achievements', () => this.showAchievements());
    }
    
    private showClassSelection(): void {
        this.log('=== 选择职业 ===', 'important');
        const classes = this.classSystem.getAllClasses();
        classes.forEach((cls, index) => {
            this.log(`${index + 1}. ${cls.name} - ${cls.description}`);
            this.log(`   特殊能力: ${cls.specialAbility}`);
        });
        this.log('按数字键 6-0 选择职业', 'important');
    }
    
    private selectClass(playerClass: PlayerClass): void {
        this.classSystem.selectClass(playerClass);
        this.classSystem.applyClassBonuses(this.player);
        const classData = this.classSystem.getCurrentClassData();
        this.log(`选择了职业: ${classData.name}`, 'important');
        this.log(`特殊能力: ${classData.specialAbility}`);
        this.updateUI();
    }
    
    private showAchievements(): void {
        const unlocked = this.achievementSystem.getUnlockedCount();
        const total = this.achievementSystem.getTotalCount();
        const percentage = this.achievementSystem.getCompletionPercentage();
        
        this.log('=== 成就系统 ===', 'important');
        this.log(`进度: ${unlocked}/${total} (${percentage}%)`);
        
        this.achievementSystem.getUnlockedAchievements().forEach(ach => {
            this.log(`✅ ${ach.name}: ${ach.description}`);
        });
        
        this.achievementSystem.getLockedAchievements().slice(0, 3).forEach(ach => {
            this.log(`🔒 ${ach.name}: ???`);
        });
    }
    
    private tryLoadSave(): void {
        if (this.saveSystem.hasSave()) {
            this.log('发现存档，按 L 加载游戏', 'important');
        }
    }
    
    private saveGame(): void {
        if (this.saveSystem.save(this.player, this.gameState)) {
            this.log('游戏已保存', 'important');
            this.log(`游戏时间: ${this.saveSystem.formatPlayTime()}`);
        } else {
            this.log('保存失败', 'danger');
        }
    }
    
    private loadGame(): void {
        const saveData = this.saveSystem.load();
        if (saveData) {
            // 恢复玩家数据
            this.player = saveData.player;
            
            // 恢复层数据
            for (const [layer, data] of Object.entries(saveData.layerData)) {
                this.gameState.setLayerData(parseInt(layer), {
                    layer: parseInt(layer),
                    maze: data.maze,
                    isGenerated: data.isGenerated,
                });
            }
            
            // 恢复当前层
            const currentLayer = saveData.currentLayer;
            this.gameState.setCurrentLayer(currentLayer);
            const layerData = this.gameState.getLayerData(currentLayer);
            if (layerData) {
                this.maze = layerData.maze;
            }
            
            this.log('游戏已加载', 'important');
            this.log(`游戏时间: ${this.saveSystem.formatPlayTime()}`);
            this.updateUI();
            this.render();
        } else {
            this.log('没有存档', 'danger');
        }
    }
    
    private placeMark(type: MarkType): void {
        if (this.markSystem.addMark(this.player.x, this.player.y, type)) {
            this.log(`标记: ${type}`, 'important');
            this.render();
        } else {
            this.log('标记数量已达上限', 'danger');
        }
    }
    
    private startGameLoop(): void {
        const gameLoop = () => {
            const now = Date.now();
            const deltaTime = (now - this.lastUpdateTime) / 1000;
            this.lastUpdateTime = now;
            
            // 更新光源系统
            this.lightSystem.update(deltaTime);
            this.lightSystem.updatePlayerVision(this.player);
            
            // 更新记忆系统
            this.memorySystem.update(this.player, this.player.layer);
            
            // 更新视野
            this.visionSystem.updateVisibility(this.maze, this.player);
            
            // 更新UI
            this.updateUI();
            
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    }
    
    private equipLight(type: LightSourceType): void {
        if (this.lightSystem.equipLightSource(this.player, type)) {
            this.log(`装备了 ${this.lightSystem.getLightStatusText()}`, 'important');
            this.lightSystem.updatePlayerVision(this.player);
        } else {
            this.log('背包中没有该光源', 'danger');
        }
    }
    
    private move(dx: number, dy: number): void {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        // 检查边界
        if (newX < 0 || newX >= this.maze.width || newY < 0 || newY >= this.maze.height) {
            return;
        }
        
        // 检查墙壁
        const cell = this.maze.cells[newY][newX];
        if (cell.type === CellType.WALL) {
            this.log('撞到了墙壁！', 'danger');
            return;
        }
        
        // 移动
        movePlayer(this.player, dx, dy);
        
        // 更新视野
        this.visionSystem.updateVisibility(this.maze, this.player);
        
        // 检查到达出口
        if (cell.type === CellType.EXIT) {
            this.log('🎉 恭喜！你找到了出口！', 'important');
        }
        
        this.updateUI();
        this.render();
    }
    
    private drawMap(): void {
        // 绘制当前视野内的所有格子
        let drawnCount = 0;
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                if (this.maze.cells[y][x].visible) {
                    const success = drawCellOnMap(
                        this.player, 
                        x, 
                        y, 
                        this.maze.cells[y][x].type
                    );
                    if (success) drawnCount++;
                }
            }
        }
        
        if (drawnCount > 0) {
            this.log(`绘制了 ${drawnCount} 个格子到地图上`);
            this.updateUI();
            this.render();
        } else {
            this.log('没有可绘制的区域', 'danger');
        }
    }
    
    private regenerate(): void {
        this.generateNewMaze();
        this.updateUI();
        this.render();
    }
    
    private render(): void {
        this.mazeRenderer.render(this.maze, this.player);
        this.mapRenderer.render(this.player, this.maze);
    }
    
    private updateUI(): void {
        // 更新状态面板
        document.getElementById('stamina')!.textContent = 
            `${this.player.stamina}/${this.player.maxStamina}`;
        document.getElementById('position')!.textContent = 
            `${this.player.x}, ${this.player.y}`;
        document.getElementById('layer')!.textContent = 
            `${this.player.layer}`;
        document.getElementById('vision')!.textContent = 
            `${this.player.visionRadius}格`;
        
        // 更新背包
        document.getElementById('paper')!.textContent = 
            `${this.player.paper}`;
        document.getElementById('pencil')!.textContent = 
            `${this.player.pencilDurability}%`;
        document.getElementById('torch')!.textContent = 
            `${this.player.torches}`;
    }
    
    private log(message: string, type: 'normal' | 'important' | 'danger' = 'normal'): void {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.messageLog.appendChild(div);
        this.messageLog.scrollTop = this.messageLog.scrollHeight;
    }
}

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
