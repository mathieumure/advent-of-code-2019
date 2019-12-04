import {run, computePart1, computePart2, getManatthanFrom, hasCollision, getStepsFrom} from '../day-03'

describe('day-O3 - part 1', () => {
    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })

    it.each`
    a | b | result
    ${['R75','D30','R83','U83','L12','D49','R71','U7','L72']} | ${['U62','R66','U55','R34','D71','R55','D58','R83']} | ${159}
    ${['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51']} | ${['U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']} | ${135}
    `('should compute right', ({a, b, result}) => {
        expect(getManatthanFrom(a, b)).toEqual(result)
    })

    // it('should compute right wisely', () => {
    //     const input = ["R8","U5","L5","D3"]
    //     const other = ["U7","R6","D4","L4"]
    //     expect(getManatthanFrom(input, other)).toEqual(false)
    // })
})

describe('day-O2 - part 2', () => {
    it('should run', async () => {
        const result = await run('part2')
        expect(result).toMatchSnapshot()
    })

    // it.each`
    // a | b | result
    // ${['R75','D30','R83','U83','L12','D49','R71','U7','L72']} | ${['U62','R66','U55','R34','D71','R55','D58','R83']} | ${610}
    // ${['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51']} | ${['U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']} | ${410}
    // `('should compute right', ({a, b, result}) => {
    //     expect(getStepsFrom(a, b)).toEqual(result)
    // })
    //
    // it('should compute right wisely', () => {
    //     const input = ["R8","U5","L5","D3"]
    //     const other = ["U7","R6","D4","L4"]
    //     expect(getStepsFrom(input, other)).toEqual(30)
    // })
})
