import {computePart2, moveRobot, run} from "../day-11";

describe('day-11 - part 1', () => {

    it('should move robot', () => {
        const move = moveRobot()
        move(1, 0)
        move(0, 0)
        move(1, 0)
        move(1, 0)
        move(0, 1)
        move(1, 0)
        const {grid, robot} = move(1, 0)
        expect(grid).toEqual()
    })

    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })
})

describe('day-10 - part 2', () => {

  it('should run', async () => {
      const result = await run('part2')
      expect(result).toMatchSnapshot()
  })
})
