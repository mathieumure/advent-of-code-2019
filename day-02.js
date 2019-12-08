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

const computeIntCode = (noun, verb, program) => {
    const items = [...program]
    items[1] = noun
    items[2] = verb
    for (let i = 0; i < items.length; i+=4) {
        const [operator, aIndex, bIndex, resultIndex] = items.slice(i, i + 4)
        if (operator === 99) {
            break;
        }
        if (operator === 1) {
            items[resultIndex] = items[aIndex] + items[bIndex]
        }
        if (operator === 2) {
            items[resultIndex] = items[aIndex] * items[bIndex]
        }
    }
    return items[0]
}

export const computePart1 = items => {
    items[1] = 12
    items[2] = 2
    for (let i = 0; i < items.length; i+=4) {
        const [operator, aIndex, bIndex, resultIndex] = items.slice(i, i + 4)
        if (operator === 99) {
            break;
        }
        if (operator === 1) {
            items[resultIndex] = items[aIndex] + items[bIndex]
        }
        if (operator === 2) {
            items[resultIndex] = items[aIndex] * items[bIndex]
        }
    }
    return items[0]
}

export const computePart2 = items => {
    let result = -1
    let noun = 0
    let verb = 0
    while(result !== 19690720 && (noun <= 99 && verb <= 99) ) {
        result = computeIntCode(noun, verb, items)
        if (result !== 19690720) {
            if (verb !== 99) {
                verb++
            } else {
                noun++
                verb = 0
            }
        }
    }
    return 100 * noun + verb
}

export const run = async part => {
    const data = await parse(`./data/day-02.txt`);
    const result = part === 'part1' ? computePart1(data) : computePart2(data)
    return result
}