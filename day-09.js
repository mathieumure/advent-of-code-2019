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
        .map(it => BigInt(it));

    return input;
}

export const execIntProgram = (program, input = []) => {
    const output = []
    computeIntProgram(program, input, out => {
        output.push(out)
    })
    return output
}


export const computePart1 = items => {
   return execIntProgram(items, [BigInt(1)])
}

export const computePart2 = items => {
    return execIntProgram(items, [BigInt(2)])
}

export const run = async part => {
    const data = await parse(`./data/day-09.txt`);
    const result = part === 'part1' ? computePart1(data) : computePart2(data)
    return result
}