import {computePart2, findBestAsteroid, run} from "../day-10";

describe('day-O9 - part 1', () => {

    it('should find best - 1', () => {
        const input = [
            '.#..#',
            '.....',
            '#####',
            '....#',
            '...##',
        ]
        expect(findBestAsteroid(input).id).toEqual("3/4")
    })

    it('should find best - 2', () => {
        const input = [
            '......#.#.',
            '#..#.#....',
            '..#######.',
            '.#.#.###..',
            '.#..#.....',
            '..#....#.#',
            '#..#....#.',
            '.##.#..###',
            '##...#..#.',
            '.#....####',
        ]
        const best = findBestAsteroid(input)
        expect(best.id).toEqual("5/8")
        expect(best.nextNodes.length).toEqual(33)
    })

    it('should find best - 3', () => {
        const input = [
            '#.#...#.#.',
            '.###....#.',
            '.#....#...',
            '##.#.#.#.#',
            '....#.#.#.',
            '.##..###.#',
            '..#...##..',
            '..##....##',
             '......#...',
            '.####.###.',
        ]
        const best = findBestAsteroid(input)
        expect(best.id).toEqual("1/2")
        expect(best.nextNodes.length).toEqual(35)
    })

    it('should find best - 4', () => {
        const input = [
            '.#..#..###',
        '####.###.#',
    '....###.#.',
            '..###.##.#',
        '##.##.#.#.',
    '....###..#',
            '..#.#..#.#',
        '#..#.#.###',
            '.##...##.#',
    '.....#.#..',
        ]
        const best = findBestAsteroid(input)
        expect(best.id).toEqual("6/3")
        expect(best.nextNodes.length).toEqual(41)
    })

    it('should find best - 5', () => {
        const input = [
            '.#..##.###...#######',
        '##.############..##.',
            '.#.######.########.#',
            '.###.#######.####.#.',
            '#####.##.#.##.###.##',
            '..#####..#.#########',
        '####################',
        '#.####....###.#.#.##',
        '##.#################',
        '#####.##.###..####..',
            '..######..##.#######',
        '####.##.####...##..#',
            '.#####..#.######.###',
        '##...#.##########...',
        '#.##########.#######',
            '.####.#.###.###.#.##',
    '....##.##.###..#####',
            '.#.#.###########.###',
        '#.#.#.#####.####.###',
        '###.##.####.##.#..##',
        ]
        const best = findBestAsteroid(input)
        expect(best.id).toEqual("11/13")
        expect(best.nextNodes.length).toEqual(210)
    })

    it('should run', async () => {
        const result = await run('part1')
        expect(result.nextNodes.length).toMatchSnapshot()
    })
})

describe('day-10 - part 2', () => {
    it.skip('should destroy in order', () => {
        const input = [
            '.#....#####...#..',
            '##...##.#####..##',
            '##...#...#.#####.',
            '..#.....#...###..',
            '..#.#.....#....##',
        ]
        const best = computePart2(input)
        expect(best.id).toEqual("11/13")
    })

    it('should find destroy order', () => {
        const input = [
            '.#..##.###...#######',
            '##.############..##.',
            '.#.######.########.#',
            '.###.#######.####.#.',
            '#####.##.#.##.###.##',
            '..#####..#.#########',
            '####################',
            '#.####....###.#.#.##',
            '##.#################',
            '#####.##.###..####..',
            '..######..##.#######',
            '####.##.####...##..#',
            '.#####..#.######.###',
            '##...#.##########...',
            '#.##########.#######',
            '.####.#.###.###.#.##',
            '....##.##.###..#####',
            '.#.#.###########.###',
            '#.#.#.#####.####.###',
            '###.##.####.##.#..##',
        ]
        const orderOfDestruction = computePart2(input)
        expect(orderOfDestruction[0].id).toEqual('11/12')
        expect(orderOfDestruction[1].id).toEqual('12/1')
        expect(orderOfDestruction[2].id).toEqual('12/2')
        expect(orderOfDestruction[9].id).toEqual('12/8')
        expect(orderOfDestruction[19].id).toEqual('16/0')
        expect(orderOfDestruction[49].id).toEqual('16/9')
        expect(orderOfDestruction[99].id).toEqual('10/16')
        expect(orderOfDestruction[198].id).toEqual('9/6')
        expect(orderOfDestruction[199].id).toEqual('8/2')
        expect(orderOfDestruction[200].id).toEqual('10/9')
        expect(orderOfDestruction[298].id).toEqual('11/1')
    })

  it('should run', async () => {
      const result = await run('part2')
      expect(result[199].id).toMatchSnapshot()
  })
})
