import {readFile} from 'fs'
import {join} from 'path'
import {promisify} from 'util'

const asyncReadFile = promisify(readFile)

export const parse = async path => {
    const data = await asyncReadFile(join(__dirname, path));
    const input = data.toString()
        .split('\n')
        [0]
        .split(',')
        .map(it => parseInt(it, 10))

    return input;
}

export const parseInstruction = instruction => {
    const opcode = parseInt(instruction.slice(-2))
    const modes = instruction.slice(0, -2).split('').map(it => parseInt(it)).reverse()
    return {opcode, modes}
}

const INSTRUCTION = {
    ADD: 1,
    MULTIPLY: 2,
    INPUT: 3,
    OUTPUT: 4,
    JUMP_IF_TRUE: 5,
    JUMP_IF_FALSE: 6,
    LESS_THAN: 7,
    EQUALS: 8,
    END: 99,
}

const INSTRUCTION_PARAMS = {
    [INSTRUCTION.ADD]: 4,
    [INSTRUCTION.MULTIPLY]: 4,
    [INSTRUCTION.INPUT]: 2,
    [INSTRUCTION.OUTPUT]: 2,
    [INSTRUCTION.JUMP_IF_TRUE]: 3,
    [INSTRUCTION.JUMP_IF_FALSE]: 3,
    [INSTRUCTION.LESS_THAN]: 4,
    [INSTRUCTION.EQUALS]: 4,
}

export const computeIntCode = (program, input) => {
    const items = [...program]
    let increment = 1;
    for (let i = 0; i < items.length; i+=increment) {
        const {opcode, modes} = parseInstruction('' + items[i])
        // console.log(items.slice(0, 20).join(','))
        // console.log('processing',opcode,'with mode', modes)
        if (opcode === INSTRUCTION.END) {
            break;
        }

        increment = INSTRUCTION_PARAMS[opcode]
        if (opcode === INSTRUCTION.ADD) {
            const param1 = items[i+1]
            const param2 = items[i+2]
            const resultIndex = items[i+3]
            const a = modes[0] ? param1 : items[param1]
            const b = modes[1] ? param2 : items[param2]
            // console.log('add ', a, b, param1, items[param1])
            items[resultIndex] = a + b
        }
        if (opcode === INSTRUCTION.MULTIPLY) {
            const param1 = items[i+1]
            const param2 = items[i+2]
            const resultIndex = items[i+3]
            const a = modes[0] ? param1 : items[param1]
            const b = modes[1] ? param2 : items[param2]
            // console.log('multiply ', a, b)
            items[resultIndex] = a * b
        }
        if(opcode === INSTRUCTION.INPUT) {
            const resultIndex = items[i+1]
            // console.log('store', 1,'in @', resultIndex)
            items[resultIndex] = input
        }
        if(opcode === INSTRUCTION.OUTPUT) {
            const param1 = items[i+1]
            const valueToPrint = modes[0] ? param1 : items[param1]
            console.log(valueToPrint)
        }
        if(opcode === INSTRUCTION.JUMP_IF_TRUE) {
            const param1 = items[i+1]
            const value = modes[0] ? param1 : items[param1]
            if (value !== 0) {
                const param2 = items[i+2]
                const jumpTo = modes[1] ? param2 : items[param2]
                i = jumpTo
                increment = 0
            }
        }
        if(opcode === INSTRUCTION.JUMP_IF_FALSE) {
            const param1 = items[i+1]
            const value = modes[0] ? param1 : items[param1]
            if (value === 0) {
                const param2 = items[i+2]
                const jumpTo = modes[1] ? param2 : items[param2]
                i = jumpTo
                increment = 0
            }
        }
        if(opcode === INSTRUCTION.LESS_THAN) {
            const param1 = items[i+1]
            const param2 = items[i+2]
            const resultIndex = items[i+3]
            const a = modes[0] ? param1 : items[param1]
            const b = modes[1] ? param2 : items[param2]
            items[resultIndex] = a < b ? 1 : 0
        }
        if(opcode === INSTRUCTION.EQUALS) {
            const param1 = items[i+1]
            const param2 = items[i+2]
            const resultIndex = items[i+3]
            const a = modes[0] ? param1 : items[param1]
            const b = modes[1] ? param2 : items[param2]
            items[resultIndex] = a === b ? 1 : 0
        }
    }
    return items[0]
}

export const computePart1 = items => {
    console.log("START_PROGRAM")
    computeIntCode(items, 1)
    console.log("END_PROGRAM")
}

export const computePart2 = items => {
    console.log("START_PROGRAM")
    computeIntCode(items, 5)
    console.log("END_PROGRAM")
}

export const run = async part => {
    const data = await parse(`./data/day-05-${part}.txt`);
    const result = part === 'part1' ? computePart1(data) : computePart2(data)
    return result
}