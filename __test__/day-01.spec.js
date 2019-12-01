import {run, computePart1, computePart2} from '../day-01'

describe('day-O1 - part 1', () => {
  it('should run', async () => {
      const result = await run('part1')
      expect(result).toEqual('the result')
  })

    it.each`
    input | result
    ${[12]} | ${2}
    ${[14]} | ${2}
    ${[1969]} | ${654}
    ${[100756]} | ${33583}
    `('should compute right', ({input, result}) => {
        expect(computePart1(input)).toEqual(result)
    })
})

describe('day-O1 - part 2', () => {
  it('should run', async () => {
      const result = await run('part2')
      expect(result).toEqual('the result')
  })

    it.each`
    input | result
    ${[14]} | ${2}
    ${[1969]} | ${966}
    ${[100756]} | ${50346}
    `('should compute right', ({input, result}) => {
        expect(computePart2(input)).toEqual(result)
    })
})
