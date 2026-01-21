import type { LevelLayout, Position } from '../component/game/index';
export class GameEngine {
    private layout: LevelLayout;
    private initialLayout: LevelLayout;
    constructor(layout: LevelLayout) {
        this.layout = layout;
        this.initialLayout = JSON.parse(JSON.stringify(layout)); // Deep copy
    }
    private moveIsValid(pos: Position): boolean {
        if(pos.x < 0 || pos.x >= this.layout.width || pos.y < 0 || pos.y >= this.layout.height) {
            return false;
        } else if(this.layout.obstacles.some(obs => obs.x === pos.x && obs.y === pos.y)) {
            return false;
        }
        return true;
    }
    private getNextPosition(): {pos : Position} {
        const {x, y} = this.layout.cat_start;
        switch(this.layout.facing) {
            case 'up':
                return { pos: { x, y: y - 1 } };
            case 'down':
                return { pos: { x, y: y + 1 } };
            case 'left':
                return { pos: { x: x - 1, y } };
            case 'right':
            default:
                return { pos: { x: x + 1, y } };
        }

    }
    moveForward(): boolean {
        const { pos } = this.getNextPosition();
        if(this.moveIsValid(pos)) {
            this.layout.cat_start = pos;
            return true;
        }
        return false;
    }
    turnLeft(): void {
        switch(this.layout.facing) {
            case 'up':
                this.layout.facing = 'left';
                break;
            case 'down':
                this.layout.facing = 'right';
                break;
            case 'left':
                this.layout.facing = 'down';
                break;
            case 'right':
                this.layout.facing = 'up';
                break;
        }
    }
    turnRight(): void {
        switch(this.layout.facing) {
            case 'up':
                this.layout.facing = 'right';
                break;
            case 'down':
                this.layout.facing = 'left';
                break;
            case 'left':
                this.layout.facing = 'up';
                break;
            case 'right':
                this.layout.facing = 'down';
                break;
        }   
    }
    getCatState() {
        return { cat_start: this.layout.cat_start, facing: this.layout.facing };
    }
    isFrontClear(): boolean {
        const { pos } = this.getNextPosition();
        return this.moveIsValid(pos);
    }
    reset(): void {
        this.layout = JSON.parse(JSON.stringify(this.initialLayout)); // Deep copy
    }
}