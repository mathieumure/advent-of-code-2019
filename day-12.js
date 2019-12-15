import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";

const asyncReadFile = promisify(readFile);

export const parse = async path => {
  const data = await asyncReadFile(join(__dirname, path));
  const input = data.toString().split("\n");

  return input;
};

class Point {
  constructor({ x, y, z }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

const compare = (a, b, key) => {
  const aValue = a[key];
  const bValue = b[key];
  if (aValue === bValue) {
    return 0;
  }
  return aValue < bValue ? 1 : -1;
};
class Moon {
  constructor({ x, y, z }) {
    this.position = new Point({ x, y, z });
    this.velocity = new Point({ x: 0, y: 0, z: 0 });
  }

  updateVelocityWithMoon(moon) {
    this.velocity.x += compare(this.position, moon.position, "x");
    this.velocity.y += compare(this.position, moon.position, "y");
    this.velocity.z += compare(this.position, moon.position, "z");
  }

  updatePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
  }

  clone() {
    const cl = new Moon(this.position);
    cl.velocity = { ...this.velocity };
    return cl;
  }

  getEnergy() {
    const pot =
      Math.abs(this.position.x) +
      Math.abs(this.position.y) +
      Math.abs(this.position.z);
    const kin =
      Math.abs(this.velocity.x) +
      Math.abs(this.velocity.y) +
      Math.abs(this.velocity.z);
    return pot * kin;
  }
}

const affectGravity = moons => {
  return moons.map((moon, i) => {
    const newMoon = moon.clone();
    moons.forEach((other, index) => {
      if (i !== index) {
        newMoon.updateVelocityWithMoon(other);
      }
    });
    newMoon.updatePosition();
    return newMoon;
  });
};

export const computePart1 = (items, nbIteration = 1000) => {
  const parseRegex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
  const moons = items.map(it => {
    const [, x, y, z] = parseRegex.exec(it).map(val => parseInt(val, 10));
    return new Moon({ x, y, z });
  });

  let currentMoonsState = moons;
  for (let i = 0; i < nbIteration; i++) {
    currentMoonsState = affectGravity(currentMoonsState);
  }

  return currentMoonsState.reduce((acc, it) => acc + it.getEnergy(), 0);
};

const detectCycleOnCoord = (coord, moons) => {
  let currentMoons = moons;
  let initialMoonsState = moons
    .map(it => `[${it.position[coord]};${it.velocity[coord]}`)
    .join(",");
  let currentMoonsState = "";
  let iterations = 0;
  while (initialMoonsState !== currentMoonsState) {
    currentMoons = affectGravity(currentMoons);
    currentMoonsState = currentMoons
      .map(it => `[${it.position[coord]};${it.velocity[coord]}`)
      .join(",");
    iterations++;
  }
  return iterations;
};

const pgcd = (a, b) => {
  let divider = a;
  let modulo = b;
  while (modulo !== 0) {
    const nextModulo = divider % modulo;
    divider = modulo;
    modulo = nextModulo;
  }
  return divider;
};

const ppcm = (a, b) => {
  if (a === 0 || b === 0) {
    return 0;
  }
  return (a * b) / pgcd(a, b);
};

export const computePart2 = items => {
  const parseRegex = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
  const moons = items.map(it => {
    const [, x, y, z] = parseRegex.exec(it).map(val => parseInt(val, 10));
    return new Moon({ x, y, z });
  });

  const iterationForCycleOnX = detectCycleOnCoord("x", moons);
  const iterationForCycleOnY = detectCycleOnCoord("y", moons);
  const iterationForCycleOnZ = detectCycleOnCoord("z", moons);

  return ppcm(
    ppcm(iterationForCycleOnX, iterationForCycleOnY),
    iterationForCycleOnZ
  );
};

export const run = async part => {
  const data = await parse(`./data/day-12.txt`);
  const result = part === "part1" ? computePart1(data) : computePart2(data);
  return result;
};
