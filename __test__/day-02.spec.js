import {run, computePart1, computePart2} from '../day-02'

describe('day-O2 - part 1', () => {
    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })

    it.each`
    input | result
    ${[1,0,0,0,99]} | ${[2,0,0,0,99]}
    ${[2,3,0,3,99]} | ${[2,3,0,6,99]}
    ${[2,4,4,5,99,0]} | ${[2,4,4,5,99,9801]}
    ${[1,1,1,4,99,5,6,0,99]} | ${[30,1,1,4,2,5,6,0,99]}
    `('should compute right', ({input, result}) => {
        expect(computePart1(input)).toEqual(result)
    })
})

describe('day-O2 - part 2', () => {
  it('should run', async () => {
      const result = await run('part2')
      expect(result).toEqual('the result')
  })
})
