import {parseInstruction} from "../day-05";

const DEFAULT_OUTPUT = out => console.log(out)

const INSTRUCTION = {
    ADD: 1,
    MULTIPLY: 2,
    INPUT: 3,
    OUTPUT: 4,
    JUMP_IF_TRUE: 5,
    JUMP_IF_FALSE: 6,
    LESS_THAN: 7,
    EQUALS: 8,
    ADJUST_RELATIVE_BASE: 9,
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
    [INSTRUCTION.ADJUST_RELATIVE_BASE]: 2,
}

const MODE = {
    POSITION: 0,
    IMMEDIATE: 1,
    RELATIVE: 2
}

export const computeIntProgram = (program, input, onOutput = DEFAULT_OUTPUT) => {
    const items = [...program]
    let increment = 1;
    const isBigInt = typeof program[0] === 'bigint';
    const getTypedValue = (value = 0) => isBigInt ? BigInt(value) : value;
    const getDefaultValue = () => getTypedValue(0)

    let readInputIndex = getDefaultValue()
    let relativeModeBase = getDefaultValue()


    const getValue = (mode, value) => {
        switch (mode) {
            case MODE.IMMEDIATE:
                return value || getDefaultValue()
            case MODE.RELATIVE:
                return items[relativeModeBase + value] || getDefaultValue()
            case MODE.POSITION:
            default:
                return items[value] || getDefaultValue()
        }
    }

    const getResultIndex = (mode, value) => {
        let resultIndex = value
        if (mode === MODE.RELATIVE) {
            resultIndex = value + relativeModeBase
        }
        return resultIndex
    }

    let nbRun = 0

    for (let i = 0; i < items.length; i += increment) {
        nbRun ++;
        const {opcode, modes} = parseInstruction('' + items[i])
        if (opcode === INSTRUCTION.END) {
            break;
        }

        increment = INSTRUCTION_PARAMS[opcode]
        if (opcode === INSTRUCTION.ADD) {
            const param1 = items[i+1]
            const param2 = items[i+2]
            const resultIndex = getResultIndex(modes[2],  items[i+3])
            const a = getValue(modes[0],  param1)
            const b = getValue(modes[1],  param2)
            // console.log('add ', a, b, param1, items[param1])
            items[resultIndex] = a + b
        }
        if (opcode === INSTRUCTION.MULTIPLY) {
            const param1 = items[i+1]
            const param2 = items[i+2]
            const resultIndex = getResultIndex(modes[2],  items[i+3])
            const a = getValue(modes[0],  param1)
            const b = getValue(modes[1],  param2)
            // console.log('multiply ', a, b)
            items[resultIndex] = a * b
        }
        if(opcode === INSTRUCTION.INPUT) {
            const resultIndex = getResultIndex(modes[0], items[i+1])
            const inputValue = input[readInputIndex]
            readInputIndex++;
            // console.log('INPUT ::: ', inputValue)
            items[resultIndex] = inputValue
        }
        if(opcode === INSTRUCTION.OUTPUT) {
            const param1 = items[i+1]
            const valueToPrint = getValue(modes[0],  param1)
            console.log(nbRun, valueToPrint)
            onOutput(valueToPrint)
        }
        if(opcode === INSTRUCTION.JUMP_IF_TRUE) {
            const param1 = items[i+1]
            const value = getValue(modes[0],  param1)
            if (value !== getTypedValue(0)) {
                const param2 = items[i+2]
                const jumpTo = getValue(modes[1],  param2)
                i = typeof jumpTo === 'bigint' ? Number(jumpTo) : jumpTo
                increment = 0
            }
        }
        if(opcode === INSTRUCTION.JUMP_IF_FALSE) {
            const param1 = items[i+1]
            const value = getValue(modes[0],  param1)
            if (value === getTypedValue(0)) {
                const param2 = items[i+2]
                const jumpTo = getValue(modes[1],  param2)
                i = typeof jumpTo === 'bigint' ? Number(jumpTo) : jumpTo
                increment = 0
            }
        }
        if(opcode === INSTRUCTION.LESS_THAN) {
            const param1 = items[i+1]
            const param2 = items[i+2]
            const resultIndex = getResultIndex(modes[2],  items[i+3])
            const a = getValue(modes[0],  param1)
            const b = getValue(modes[1],  param2)
            items[resultIndex] = a < b ? getTypedValue(1) : getTypedValue(0)
        }
        if(opcode === INSTRUCTION.EQUALS) {
            const param1 = items[i+1]
            const param2 = items[i+2]
            const resultIndex = getResultIndex(modes[2],  items[i+3])
            const a = getValue(modes[0],  param1)
            const b = getValue(modes[1],  param2)
            items[resultIndex] = a === b ? getTypedValue(1) : getTypedValue(0)
        }
        if(opcode === INSTRUCTION.ADJUST_RELATIVE_BASE) {
            const param1 = items[i+1]
            const relativeModeBaseIncrement = getValue(modes[0], param1)
            relativeModeBase += relativeModeBaseIncrement
        }
    }
    return items[0]
}

export const computeIntProgramWithState = (program, start, input, onOutput, onEnd) => {
    const items = [...program]
    let increment = 1;
    let readInputIndex = 0
    for (let i = start; i < items.length; i+=increment) {
        const {opcode, modes} = parseInstruction('' + items[i])
        if (opcode === INSTRUCTION.END) {
            // console.log('END')
            return onEnd();
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
            const inputValue = input[readInputIndex]
            readInputIndex++;
            // console.log('INPUT ::: ', inputValue)
            items[resultIndex] = inputValue
        }
        if(opcode === INSTRUCTION.OUTPUT) {
            const param1 = items[i+1]
            const valueToPrint = modes[0] ? param1 : items[param1]
            // console.log('OUTPUT')
            return onOutput(valueToPrint, items, i + increment)
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