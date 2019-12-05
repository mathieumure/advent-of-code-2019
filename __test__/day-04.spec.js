import {
    run,
    computePart1,
    computePart2,
    hasOnlyIncrementalChar,
    isCompliant,
    isCompliantWithOnlyTwoSameDigit
} from '../day-04'

describe('day-O4 - part 1', () => {

    it.each`
    password | result
    ${'123456'} | ${true}
    ${'111111'} | ${true}
    ${'223450'} | ${false}
    ${'989999'} | ${false}
    `('hasOnlyIncrementalChar', ({password, result}) => {
        expect(hasOnlyIncrementalChar(password)).toEqual(result)
    })

    it.each`
    password | result
    ${'123456'} | ${false}
    ${'111111'} | ${true}
    ${'223450'} | ${false}
    ${'989999'} | ${false}
    `('$password isCompliant', ({password, result}) => {
        expect(isCompliant(password)).toEqual(result)
    })

    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })
})

describe('day-O2 - part 2', () => {

    it.each`
    password | result
    ${'123456'} | ${false}
    ${'111111'} | ${false}
    ${'223450'} | ${false}
    ${'989999'} | ${false}
    ${'112233'} | ${true}
    ${'123444'} | ${false}
    ${'111122'} | ${true}
    `('$password isCompliant', ({password, result}) => {
        expect(isCompliantWithOnlyTwoSameDigit(password)).toEqual(result)
    })

    it('should run', async () => {
        const result = await run('part2')
        expect(result).toMatchSnapshot()
    })

})
