import {readFile} from 'fs'
import {join} from 'path'
import {promisify} from 'util'

const asyncReadFile = promisify(readFile)

export const parse = async path => {
    const data = await asyncReadFile(join(__dirname, path));
    const input = data.toString()
        .split('\n')[0]

    return input;
}

export const hasOnlyIncrementalChar = password => password.split('').every((it, index, array) => {
    const nextChar = array[index+1]
    if (!nextChar) {
        return true;
    }
    return it <=nextChar
})

export const isCompliant = password => {
    // Length
    if (password.length !== 6) {
        return false;
    }
    // Two same digit consecutive
    if (!/(\d)\1/.test(password)) {
        return false;
    }

    if (!hasOnlyIncrementalChar(password)) {
        return false
    }

    return true;
}

export const isCompliantWithOnlyTwoSameDigit = password => {
    // Length
    if (!isCompliant(password)) {
        return false;
    }

    // only Two same digit consecutive
    let match;
    const groups = []
    const sameDigitSequenceRegex = /(\d)\1+/g
    while ((match = sameDigitSequenceRegex.exec(password)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === sameDigitSequenceRegex.lastIndex) {
            regex.lastIndex++;
        }

        match.forEach(match => {
            groups.push(match)
        });
    }

    return groups.some(it => it.length === 2);
}

export const computePart1 = items => {
    const [start, end] = items.split('-')
    const compliantsPasswords = []
    for (let i = start; i<=end; i++) {
        if (isCompliant(`${i}`)) {
            compliantsPasswords.push(i)
        }
    }
    return compliantsPasswords.length
}

export const computePart2 = items => {
    const [start, end] = items.split('-')
    const compliantsPasswords = []
    for (let i = start; i<=end; i++) {
        if (isCompliantWithOnlyTwoSameDigit(`${i}`)) {
            compliantsPasswords.push(i)
        }
    }
    console.log(compliantsPasswords)
    return compliantsPasswords.length
}

export const run = async part => {
    const data = await parse(`./data/day-04.txt`);
    const result = part === 'part1' ? computePart1(data) : computePart2(data)
    return result
}