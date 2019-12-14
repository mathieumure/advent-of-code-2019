import {computePart1, computePart2, run} from "../day-13";

describe('day-13 - part 1', () => {
    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })
})

describe('day-13 - part 2', () => {
  it('should run', async () => {
      const result = await run('part2')
      expect(result).toMatchSnapshot()
  })
})
