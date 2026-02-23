import type { LevelLayout } from '../component/game/index';
import type { Position } from '../type/gameType';
export class GameEngine {
    private layout: LevelLayout;
    private initialLayout: LevelLayout;
    private deg: number;
    private initialDeg: number;
    constructor(layout: LevelLayout, deg: number) {
        this.layout = layout;
        this.initialLayout = JSON.parse(JSON.stringify(layout)); // Deep copy
        this.deg = deg;
        this.initialDeg = deg;
        this.layout.facing = this.degToFacing(deg);
    }
    private degToFacing(deg: number): 'up' | 'down' | 'left' | 'right' {
        // Normalize deg to 0-360
        const normalizedDeg = ((deg % 360) + 360) % 360;
        switch(normalizedDeg) {
            case 0:
                return 'right';
            case 90:
                return 'down';
            case 180:
                return 'left';
            case 270:
                return 'up';
            default:
                return 'right';
        }
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
        this.deg -= 90;
        this.layout.facing = this.degToFacing(this.deg);
    }
    turnRight(): void {
        this.deg += 90;
        this.layout.facing = this.degToFacing(this.deg);
    }
    getCatState() {
        return { cat_start: this.layout.cat_start, deg: this.deg };
    }
    isFrontClear(): boolean {
        const { pos } = this.getNextPosition();
        return this.moveIsValid(pos);
    }
    reset(): void {
        this.layout = JSON.parse(JSON.stringify(this.initialLayout));
        this.deg = this.initialDeg;
        this.layout.facing = this.degToFacing(this.deg);
    }
}