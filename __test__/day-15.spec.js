import {DAY, computePart1, computePart2, run, parseRequest} from "../day-15";

describe(`day-15 - part 1`, () => {

    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })
})

describe(`day-15 - part 2`, () => {
  it('should run', async () => {
      const result = await run('part2')
      expect(result).toMatchSnapshot()
  })
})
