import {run, parseOrbits, computePart1, computePart2} from '../day-06'

describe('day-O6 - part 1', () => {
    it('should parse orbits', () => {
        const input = [
            'COM)B',
            'B)C',
            'C)D',
            'D)E',
            'E)F',
            'B)G',
            'G)H',
            'D)I',
            'E)J',
            'J)K',
            'K)L'
        ];
        expect(Object.values(parseOrbits(input)).map(it => it.toString())).toMatchSnapshot()
    })

    it('should compute ex1', () => {
        const input = [
            'COM)B',
            'B)C',
            'C)D',
            'D)E',
            'E)F',
            'B)G',
            'G)H',
            'D)I',
            'E)J',
            'J)K',
            'K)L'
        ];
        expect(computePart1(input)).toEqual(42)
    })

    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })
})

describe('day-O2 - part 2', () => {

    it('should compute ex1', () => {
        const input = [
            'COM)B',
            'B)C',
            'C)D',
            'D)E',
            'E)F',
            'B)G',
            'G)H',
            'D)I',
            'E)J',
            'J)K',
            'K)L',
            'K)YOU',
            'I)SAN',
        ];
        expect(computePart2(input)).toEqual(4)
    })

  it('should run', async () => {
      const result = await run('part2')
      expect(result).toMatchSnapshot()
  })
})
