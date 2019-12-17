import { run } from "../day-17";

describe(`day-17 - part 1`, () => {
  it("should run", async () => {
    const result = await run("part1");
    expect(result).toMatchSnapshot();
  });
});

describe(`day-17 - part 2`, () => {
  it("should run", async () => {
    const result = await run("part2");
    expect(result).toMatchSnapshot();
  });
});
