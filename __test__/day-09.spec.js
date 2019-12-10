import {computePart1, execIntProgram, run} from '../day-09'

describe('day-O9 - part 1', () => {

    it('should get a copy of itself', () => {
        const input = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99].map(it => BigInt(it))
        expect(execIntProgram(input).map(it => it.toString())).toEqual(input.map(it => it.toString()))
    })

    it('should output 16 digit number', () => {
        const input = [1102,34915192,34915192,7,4,7,99,0].map(it => BigInt(it))
        expect(execIntProgram(input)[0].toString()).toHaveLength(16)
    })

    it('should output large number', () => {
        const input = [BigInt(104),BigInt(1125899906842624),BigInt(99)]
        expect(execIntProgram(input).toString()).toEqual(BigInt(1125899906842624).toString())
    })

    it('should run', async () => {
        const result = await run('part1')
        expect(result[0]).toMatchSnapshot()
    })
})

describe('day-O9 - part 2', () => {
  it('should run', async () => {
      const result = await run('part2')
      expect(result).toMatchSnapshot()
  })
})
