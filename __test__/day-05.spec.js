import {run, computeIntCode, parseInstruction} from '../day-05'

describe('day-O5 - part 1', () => {
    it('should run', async () => {
        const result = await run('part1')
        expect(result).toMatchSnapshot()
    })

    it('should parse instruction', () => {
        expect(parseInstruction('1002')).toEqual({
            opcode: 2,
            modes: [0, 1]
        })
    })
})

describe('day-O2 - part 2', () => {
    // it('should work', () => {
    //     const program = [3,3,1105,-1,9,1101,0,0,12,4,12,99,1]
    //     expect(computeIntCode(program, 98)).toBe(false)
    // })
  it('should run', async () => {
      const result = await run('part2')
      expect(result).toEqual('the result')
  })
})
