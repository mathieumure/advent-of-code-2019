import {readFile} from 'fs'
import {join} from 'path'
import {promisify} from 'util'
import {Grid, Point} from "./utils/Space";
import {computeIntProgramWithState} from "./utils/intProgram";
import depthFirstSearch from "./utils/DFS";
import {dijkstra} from "./utils/dijkstra";

const asyncReadFile = promisify(readFile);

export const DAY = '15';

export const parse = async path => {
    const data = await asyncReadFile(join(__dirname, path));
    return data.toString()
        .split('\n')[0]
        .split(',')
        .map(it => BigInt(it));
};

const INSTRUCTIONS = {
    NORTH: 1,
    SOUTH: 2,
    EAST: 3,
    WEST: 4,
};

const RESULT = {
    WALL: 0,
    EMPTY: 1,
    OXYGEN_ROOM: 2
};

const EMOJI_BY_TYPE = {
    undefined: '🟪',
    0: '⬛️',
    1: '⬜️',
    2: '🟥'
}

class MazeGrid extends Grid {
    getOrDefault (x, y) {
        return this.get(x, y) || new Point({x, y})
    }
    getNeighbors(point) {
        if (point.type === RESULT.WALL) {
            return []
        }

        const top = this.getOrDefault(point.x, point.y + 1)
        const right = this.getOrDefault(point.x + 1, point.y)
        const bottom = this.getOrDefault(point.x, point.y - 1)
        const left = this.getOrDefault(point.x - 1, point.y)

        return [top, right, bottom, left]
    }
}

const getDirection = (prevPoint, currentPoint) => {
    if (currentPoint.y > prevPoint.y) {
        return INSTRUCTIONS.NORTH
    }
    if (currentPoint.y < prevPoint.y) {
        return INSTRUCTIONS.SOUTH
    }
    if (currentPoint.x < prevPoint.x) {
        return INSTRUCTIONS.WEST
    }
    if (currentPoint.x > prevPoint.x) {
        return INSTRUCTIONS.EAST
    }
}

const parseMap = (intProgram, startPointer = 0, startPoint= {}, stopWhenFound = false) => {
    const grid = new MazeGrid();

    const robot = new Point({...startPoint, x: 0, y: 0, type: 'robot'});

    let intProgramState = intProgram
    let iterations = 0
    let currentDepth = 0
    let maxDepth = 0

    let intProgramStateWhenFound
    let startPointerWhenFound

    depthFirstSearch(grid, robot, {
        enterVertex ({currentVertex, previousVertex}) {
            if (previousVertex === null || currentVertex === null) {
                return;
            }
            currentDepth ++
            if (currentDepth > maxDepth) {
                maxDepth = currentDepth
            }
            const direction = getDirection(previousVertex, currentVertex);
            const result = computeIntProgramWithState(intProgramState, startPointer, [BigInt(direction)], (output, pgmState, nextPointer) => {
                intProgramState = pgmState
                startPointer = nextPointer
                return Number(output);
            })
            currentVertex.type = result;
            grid.push(currentVertex);
            if (currentVertex.type === RESULT.OXYGEN_ROOM) {
                iterations = currentDepth
                intProgramStateWhenFound = intProgramState
                startPointerWhenFound = startPointer
            }
        },
        leaveVertex ({currentVertex, previousVertex}) {
            if (previousVertex === null || currentVertex === null) {
                return;
            }
            currentDepth--
            if (currentVertex.type === RESULT.WALL) {
                return;
            }
            const direction = getDirection(currentVertex, previousVertex);
            computeIntProgramWithState(intProgramState, startPointer, [BigInt(direction)], (output, pgmState, nextPointer) => {
                intProgramState = pgmState
                startPointer = nextPointer
                return Number(output);
            })
        }
    })

    return {grid, iterations, maxDepth, intProgramStateWhenFound, startPointerWhenFound}

};

export const computePart1 = items => {
    const {iterations} = parseMap(items)
    return iterations;
};


export const computePart2 = items => {
    const {grid, intProgramStateWhenFound, startPointerWhenFound} = parseMap(items, undefined, undefined, true)
    const oxygenRoom = grid.getAllPoints().find(it => it.type === RESULT.OXYGEN_ROOM)
    const {maxDepth} = parseMap(intProgramStateWhenFound, startPointerWhenFound, oxygenRoom)
    return maxDepth - 1;
};

export const run = async part => {
    const data = await parse(`./data/day-${DAY}.txt`);
    return part === 'part1' ? computePart1(data) : computePart2(data)
};