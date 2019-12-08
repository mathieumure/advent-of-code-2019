import {readFile} from 'fs'
import {join} from 'path'
import {promisify} from 'util'
import {computeIntProgram, computeIntProgramWithState} from "./utils/intProgram";

const asyncReadFile = promisify(readFile)

export const parse = async path => {
    const data = await asyncReadFile(join(__dirname, path));
    const input = data.toString()
        .split('\n')[0]
        .split(',')
        .map(it => parseInt(it, 10));

    return input;
}

export const findAllSequences = availableValue => availableValue.reduce((acc, currentValue) => {
    const otherValues = availableValue.filter(it => it !== currentValue);
    if (otherValues.length !== 0) {
        const subSequences = findAllSequences(otherValues);
        subSequences
            .map(it => [currentValue, ...it])
            .forEach(it => acc.push(it))
    } else {
        acc.push([currentValue])
    }
    return acc;
}, [])

export const sequentialIntProgram = (intProgram, sequence) => {
    let output = 0;
    sequence.forEach(seqVal => {
        // console.log("######### RUNNING SEQUENCE VALUE ############")
        // console.log({seqVal, output})
        computeIntProgram(intProgram, [seqVal, output], newOut => {output = newOut})
    })
    return output
}

export const loopIntProgram = (intProgram, sequence) => {
    let output = 0;
    let stop;
    const aopProgram = sequence.map(() => ({
        programState: intProgram,
        start: 0
    }));
    let firstRun = true

    while(true) {
        for (let seqIndex = 0; seqIndex < sequence.length; seqIndex++) {
            const seqVal = sequence[seqIndex];
            // console.log("######### RUNNING SEQUENCE VALUE ############", seqIndex, output)
            const onOut = (nextOut, programState, instrPointer) => {
                // console.log('onOut')
                output = nextOut
                aopProgram[seqIndex] = {
                    programState, start: instrPointer
                }
            }
            const currentProgram = aopProgram[seqIndex]
            const input = firstRun ? [seqVal, output] : [output]
            // console.log('computeProgramWithState')
            computeIntProgramWithState(currentProgram.programState, currentProgram.start  ,input,  onOut, () => {
                // console.log('end')
                stop = true
            })
            if (stop) {
                break
            }
        }
        firstRun = false
        if (stop) {
            break;
        }
    }
    // console.log({output})
    return output
}

export const computePart1 = items => {
    const sequences = findAllSequences([0, 1, 2, 3, 4])
    return sequences.reduce((acc, sequence) => {
        const result = sequentialIntProgram(items, sequence);
        // console.log({acc, result})
        if (result > acc) {
            return result;
        } else {
            return acc;
        }
    }, 0)
}

export const computePart2 = items => {
    const sequences = findAllSequences([5, 6, 7, 8, 9])
    return sequences.reduce((acc, sequence) => {
        const result = loopIntProgram(items, sequence);
        // console.log({acc, result})
        if (result > acc) {
            return result;
        } else {
            return acc;
        }
    }, 0)
}

export const run = async part => {
    const data = await parse(`./data/day-07.txt`);
    const result = part === 'part1' ? computePart1(data) : computePart2(data)
    return result
}