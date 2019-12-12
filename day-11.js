import {readFile} from 'fs'
import {join} from 'path'
import {promisify} from 'util'
import {computeIntProgram} from "./utils/intProgram";

const asyncReadFile = promisify(readFile)

export const parse = async path => {
    const data = await asyncReadFile(join(__dirname, path));
    const input = data.toString()
        .split('\n')[0]
        .split(',')
        .map(it => BigInt(it));

    return input;
}

class Grid {
    constructor() {
        this.points = []
    }

    get(x, y) {
        let point = this.points.find(it => it.x === x && it.y === y);
        if (!point) {
            point = new Point({x, y});
            this.points.push(point)
        }
        return point
    }

    print () {
        const {minX, maxX, minY, maxY} = this.points.reduce((acc, point) => {
            return {
                minX: point.x < acc.minX ? point.x : acc.minX,
                minY: point.y < acc.minY ? point.y : acc.minY,
                maxX: point.x > acc.maxX ? point.x : acc.maxX,
                maxY: point.y > acc.maxY ? point.y : acc.maxY,
            }
        }, {
            minX: Number.MAX_SAFE_INTEGER,
            minY: Number.MAX_SAFE_INTEGER,
            maxX: Number.MIN_SAFE_INTEGER,
            maxY: Number.MIN_SAFE_INTEGER
        });

        let line = ''
        for (let y = maxY; y >= minY; y--) {
            for(let x = minX; x <= maxX; x++) {
                const point = this.get(x, y)
                line += point.isWhite() ? "⬜️" : "⬛️"
            }
            line += '\n'
        }
        return line
    }
}

class Point {
    constructor({x, y, type}) {
        this.x = x;
        this.y = y;
        this.type = type || 'X';
    }

    setType(colorType) {
        if (colorType === 0) {
            this.type = 'X'
        }
        if (colorType === 1) {
            this.type = '.'
        }
    }

    isBlack () {
        return this.type === 'X'
    }

    isWhite () {
        return this.type === '.'
    }
}

const DIRECTION = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
}

class Robot {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.direction = DIRECTION.UP
    }

    move (code) {
        if (code === 0) {
            this.direction = this.turnLeft()
        }
        if (code === 1) {
            this.direction = this.turnRight()
        }
        switch (this.direction) {
            case DIRECTION.UP: {
                this.y = this.y + 1
                break;
            }
            case DIRECTION.LEFT: {
                this.x = this.x - 1
                break;
            }
            case DIRECTION.DOWN: {
                this.y = this.y - 1
                break;
            }
            case DIRECTION.RIGHT: {
                this.x = this.x + 1
                break;
            }
        }
    }

    turnLeft () {
        switch (this.direction) {
            case DIRECTION.UP: return DIRECTION.LEFT;
            case DIRECTION.LEFT: return DIRECTION.DOWN;
            case DIRECTION.DOWN: return DIRECTION.RIGHT;
            case DIRECTION.RIGHT: return DIRECTION.UP;
        }
    }

    turnRight () {
        switch (this.direction) {
            case DIRECTION.UP: return DIRECTION.RIGHT;
            case DIRECTION.RIGHT: return DIRECTION.DOWN;
            case DIRECTION.DOWN: return DIRECTION.LEFT;
            case DIRECTION.LEFT: return DIRECTION.UP;
        }
    }
}

export const moveRobot = (grid = new Grid(), robot = new Robot()) => (color, next) => {
    const point = grid.get(robot.x, robot.y)
    point.setType(color)
    robot.move(next)

    return {grid, robot}
}

export const computePart1 = items => {
    const move = moveRobot();
    let color = BigInt(0);
    let output = []
    let resultGrid = null
    let nb = 0
    computeIntProgram(items, [color], val => {
        output.push(val)
        if (output.length === 2) {
            nb++
            const {grid, robot} = move(Number(output[0]), Number(output[1]))
            resultGrid = grid
            const robotPoint = grid.get(robot.x, robot.y)
            output = []
            return robotPoint.isBlack() ? BigInt(0) : BigInt(1)
        }
    });

    // console.log(resultGrid.print())

    return resultGrid.points.length
}

export const computePart2 = items => {
    const move = moveRobot();
    let color = BigInt(1);
    let output = []
    let resultGrid = null
    let nb = 0
    computeIntProgram(items, [color], val => {
        output.push(val)
        if (output.length === 2) {
            nb++
            const {grid, robot} = move(Number(output[0]), Number(output[1]))
            resultGrid = grid
            const robotPoint = grid.get(robot.x, robot.y)
            output = []
            return robotPoint.isBlack() ? BigInt(0) : BigInt(1)
        }
    });

    console.log(resultGrid.print())

    return resultGrid.points.length
}

export const run = async part => {
    const data = await parse(`./data/day-11.txt`);
    const result = part === 'part1' ? computePart1(data) : computePart2(data)
    return result
}