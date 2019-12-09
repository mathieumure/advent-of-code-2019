import {computePart1, parseLayers, run} from '../day-08'

describe('day-O8 - part 1', () => {

    it('should find layers', () => {
        const input = [1,2,3,4,5,6,7,8,9,0,1,2]
        const layer1 = [
            [1,2,3],
            [4,5,6]
        ]
        const layer2 = [
            [7,8,9],
            [0,1,2]
        ]
        const layers = parseLayers(3,2)(input)
        expect(layers.map(it => it.pixels)).toEqual([layer1, layer2])
    })

    it('should find the layer with the fewest digit', () => {
        const input = [1,2,3,4,4,6,7,8,9,0,1,0,6, 7, 8, 3, 0, 1]
        const layers = computePart1(input)
        expect(layers).toEqual(4)
    })

    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })
})

describe('day-O8 - part 2', () => {
  it('should run', async () => {
      const result = await run('part2')
      expect(result).toMatchSnapshot()
  })
})
