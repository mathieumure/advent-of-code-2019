import {readFile} from 'fs'
import {join} from 'path'
import {promisify} from 'util'

const asyncReadFile = promisify(readFile)

export const parse = async path => {
    const data = await asyncReadFile(join(__dirname, path));
    return data.toString().split('\n').map(it => parseInt(it, 10))
}

export const computePart1 = items => {
    return items.reduce((acc, it) => {
        const computedValue = Math.floor(it / 3) - 2
        return acc + computedValue
    }, 0)
}

const getAmountFuelForWeight = weight => {
    const fuelNeeded = Math.floor(weight / 3) - 2
    if (fuelNeeded <= 0) {
        return 0
    } else {
        return fuelNeeded + getAmountFuelForWeight(fuelNeeded)
    }
}

export const computePart2 = items => {
    return items.reduce((acc, it) => {
        const computedValue = getAmountFuelForWeight(it)
        return acc + computedValue
    }, 0)
}

export const run = async part => {
    const data = await parse(`./data/day-01-${part}.txt`);
    const result = part === 'part1' ? computePart1(data) : computePart2(data)
    return result
}