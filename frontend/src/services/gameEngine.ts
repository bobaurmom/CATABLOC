/**
 * @file gameEngine.ts
 * @description A class for managing the game engine logic for purfect pathing.
 * @author sovath
 * @version 1.0
 * @date 2026-03-12
 * 
 * @class GameEngine
 * 
 * @type {object} Position - Represents a position on the grid with x and y coordinates.
 * @property {number} x - The x-coordinate of the position.
 * @property {number} y - The y-coordinate of the position.
 * 
 * @type {object} LevelLayout - The structure of the level layout, including grid size, cat's starting position, obstacles, and target position.
 * @property {number} width - The width of the grid.
 * @property {number} height - The height of the grid.
 * @property {Position} cat_start - The starting position of the cat.
 * @property {Position} goal - The target position the cat needs to reach.
 * @property {Position[]} obstacles - An array of positions representing obstacles on the grid.
 * @property {string} facing - The direction the cat is currently facing ('up', 'down', 'left', 'right').
 * 
 * @constructor
 * @param {LevelLayout} layout - The initial layout of the level, including the grid size, cat's starting position, obstacles, and target position.
 * @param {number} deg - The initial facing direction of the cat in degrees (0 for right, 90 for down, 180 for left, 270 for up).
 * 
 * @method moveForward() - Moves the cat forward in the direction it is currently facing. Returns true if the move is successful, false if it is blocked by an obstacle or boundary.
 * @method turnLeft() - Turns the cat to the left by 90 degrees.
 * @method turnRight() - Turns the cat to the right by 90 degrees.
 * @method getCatState() - Returns the current state of the cat, including its position and facing direction.
 * @method isFrontClear() - Checks if the space in front of the cat is clear of obstacles.
 * @method reset() - Resets the game engine to its initial state.
 * @method isComplete() - Checks if the cat has reached the target position.   
 * 
 * @see {@link src/page/level.tsx } - to see how the GameEngine is used in the Level component.
 **/
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
    isComplete(): boolean {
        return this.layout.cat_start.x === this.layout.goal.x && this.layout.cat_start.y === this.layout.goal.y;
    }
}