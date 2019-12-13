import {computePart1, computePart2, run} from "../day-12";

describe('day-12 - part 1', () => {

    it('should compute part 1', () => {
        const input = [
        '<x=-1, y=0, z=2>',
        '<x=2, y=-10, z=-7>',
        '<x=4, y=-8, z=8>',
        '<x=3, y=5, z=-1>',
        ]

        expect(computePart1(input, 10)).toEqual(179)
    })

    it('should compute part 1 again', () => {
        const input = [
        '<x=-8, y=-10, z=0>',
        '<x=5, y=5, z=10>',
        '<x=2, y=-7, z=3>',
        '<x=9, y=-8, z=-3>',
        ]

        expect(computePart1(input, 100)).toEqual(1940)
    })

    it('should compute part 1 test', () => {
        const input = [
            '<x=-8, y=-10, z=0>',
            '<x=5, y=5, z=10>',
            '<x=2, y=-7, z=3>',
            '<x=9, y=-8, z=-3>',
        ]

        expect(computePart1(input, 1)).toEqual(312)
    })

    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })
})

describe('day-10 - part 2', () => {

    it('should compute part 2', () => {
        const input = [
            '<x=-1, y=0, z=2>',
            '<x=2, y=-10, z=-7>',
            '<x=4, y=-8, z=8>',
            '<x=3, y=5, z=-1>',
        ]

        expect(computePart2(input).toString()).toEqual('2772')
    })

    it('should compute part 2 again', () => {
        const input = [
            '<x=-8, y=-10, z=0>',
            '<x=5, y=5, z=10>',
            '<x=2, y=-7, z=3>',
            '<x=9, y=-8, z=-3>',
        ]

        expect(computePart2(input)).toEqual(4686774924)
    })

  it('should run', async () => {
      const result = await run('part2')
      expect(result).toMatchSnapshot()
  })
})
