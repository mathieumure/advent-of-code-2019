import {
  getPatternNumber,
  nextSignal,
  iterateThroughPhase,
  run,
  computePart1,
  computePart2
} from "../day-16";

describe(`day-16 - part 1`, () => {
  it("should getPattern", () => {
    const input = [0, 1, 0, -1];
    expect(getPatternNumber(input, 0, 0)).toEqual(1);
    expect(getPatternNumber(input, 0, 1)).toEqual(0);
    expect(getPatternNumber(input, 0, 2)).toEqual(-1);
    expect(getPatternNumber(input, 0, 3)).toEqual(0);
    expect(getPatternNumber(input, 0, 4)).toEqual(1);
    expect(getPatternNumber(input, 0, 5)).toEqual(0);
    expect(getPatternNumber(input, 0, 6)).toEqual(-1);
    expect(getPatternNumber(input, 0, 7)).toEqual(0);

    expect(getPatternNumber(input, 1, 0)).toEqual(0);
    expect(getPatternNumber(input, 1, 1)).toEqual(1);
    expect(getPatternNumber(input, 1, 2)).toEqual(1);
    expect(getPatternNumber(input, 1, 3)).toEqual(0);
    expect(getPatternNumber(input, 1, 4)).toEqual(0);
    expect(getPatternNumber(input, 1, 5)).toEqual(-1);
    expect(getPatternNumber(input, 1, 6)).toEqual(-1);
    expect(getPatternNumber(input, 1, 7)).toEqual(0);
  });

  it("should nextPhase", () => {
    const pattern = [0, 1, 0, -1];
    const signal = "12345678";

    let next = nextSignal(pattern, signal);
    expect(next).toEqual("48226158");

    next = nextSignal(pattern, next);
    expect(next).toEqual("34040438");

    next = nextSignal(pattern, next);
    expect(next).toEqual("03415518");

    next = nextSignal(pattern, next);
    expect(next).toEqual("01029498");
  });

  it("should iterateThroughPhase", () => {
    const pattern = [0, 1, 0, -1];
    const signal = "12345678";

    expect(iterateThroughPhase(pattern, signal, 1)).toEqual("48226158");
    expect(iterateThroughPhase(pattern, signal, 2)).toEqual("34040438");
    expect(iterateThroughPhase(pattern, signal, 3)).toEqual("03415518");
    expect(iterateThroughPhase(pattern, signal, 4)).toEqual("01029498");
  });

  it("should computePart1", () => {
    expect(computePart1("80871224585914546619083218645595")).toEqual(
      "24176176"
    );
    expect(computePart1("19617804207202209144916044189917")).toEqual(
      "73745418"
    );
    expect(computePart1("69317163492948606335995924319873")).toEqual(
      "52432133"
    );
  });

  it("should run", async () => {
    const result = await run("part1");
    expect(result).toMatchSnapshot();
  });
});

describe(`day-16 - part 2`, () => {
  it("should computePart2", () => {
    expect(computePart2("03036732577212944063491565474664")).toEqual(
      "84462026"
    );
    expect(computePart2("02935109699940807407585447034323")).toEqual(
      "78725270"
    );
    expect(computePart2("03081770884921959731165446850517")).toEqual(
      "53553731"
    );
  });

  it("should run", async () => {
    const result = await run("part2");
    expect(result).toMatchSnapshot();
  });
});
