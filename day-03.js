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
  constructor({ x, y, cost }) {
    this.x = x;
    this.y = y;
    this.cost = cost || 0;
  }

  up(amount) {
    this.y = this.y + amount;
    this.cost += amount;
  }

  down(amount) {
    this.y = this.y - amount;
    this.cost += amount;
  }

  left(amount) {
    this.x = this.x - amount;
    this.cost += amount;
  }

  right(amount) {
    this.x = this.x + amount;
    this.cost += amount;
  }
}

export const manhattanDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

export const hasCollision = (v1, v2) => {
  const coefDirecteurV1 = (v1.y2 - v1.y1) / (v1.x2 - v1.x1);
  const coefDirecteurV2 = (v2.y2 - v2.y1) / (v2.x2 - v2.x1);
  const ordonneAOrigine1 = v1.y1 - coefDirecteurV1 * v1.x1;
  const ordonneAOrigine2 = v2.y1 - coefDirecteurV2 * v2.x1;

  console.log({
    coefDirecteurV1,
    coefDirecteurV2,
    ordonneAOrigine1,
    ordonneAOrigine2
  });

  if (coefDirecteurV1 === coefDirecteurV2) {
    return false;
  }

  const commonX =
    (ordonneAOrigine2 - ordonneAOrigine1) / (coefDirecteurV1 - coefDirecteurV2);

  const onV1 =
    v1.x2 <= v1.x1
      ? v1.x1 >= commonX && commonX <= v1.x2
      : v1.x2 >= commonX && commonX <= v1.x1;

  const onV2 =
    v2.x2 <= v2.x1
      ? v2.x1 >= commonX && commonX <= v2.x2
      : v2.x2 >= commonX && commonX <= v2.x1;

  return onV1 && onV2;
};

const getPointForAmountAndDirection = (initialPoint, direction, i) => {
  switch (direction) {
    case "U": {
      return new Point({ x: initialPoint.x, y: initialPoint.y + i + 1 });
    }
    case "D": {
      return new Point({ x: initialPoint.x, y: initialPoint.y - (i + 1) });
    }
    case "R": {
      return new Point({ x: initialPoint.x + (i + 1), y: initialPoint.y });
    }
    case "L": {
      return new Point({ x: initialPoint.x - (i + 1), y: initialPoint.y });
    }
  }
};

export const getManatthanFrom = (mapping1, mapping2) => {
  let initialPoint = new Point({ x: 0, y: 0 });
  const alreadyWiredPoints = [new Point({ x: 0, y: 0 })];
  const conflictPoints = [];

  mapping1.forEach(command => {
    const [direction, ...amountStr] = command;
    const amount = parseInt(amountStr.join(""), 10);

    switch (direction) {
      case "U": {
        for (let i = 0; i < amount; i++) {
          alreadyWiredPoints.push(
            new Point({ x: initialPoint.x, y: initialPoint.y + i + 1 })
          );
        }
        initialPoint.up(amount);
        break;
      }
      case "D": {
        for (let i = 0; i < amount; i++) {
          alreadyWiredPoints.push(
            new Point({ x: initialPoint.x, y: initialPoint.y - (i + 1) })
          );
        }
        initialPoint.down(amount);
        break;
      }
      case "R": {
        for (let i = 0; i < amount; i++) {
          alreadyWiredPoints.push(
            new Point({ x: initialPoint.x + (i + 1), y: initialPoint.y })
          );
        }
        initialPoint.right(amount);
        break;
      }
      case "L": {
        for (let i = 0; i < amount; i++) {
          alreadyWiredPoints.push(
            new Point({ x: initialPoint.x - (i + 1), y: initialPoint.y })
          );
        }
        initialPoint.left(amount);
        break;
      }
    }
  });

  initialPoint = new Point({ x: 0, y: 0 });
  mapping2.forEach(command => {
    const [direction, ...amountStr] = command;
    const amount = parseInt(amountStr.join(""), 10);

    for (let i = 0; i < amount; i++) {
      const point = getPointForAmountAndDirection(initialPoint, direction, i);
      const conflict = alreadyWiredPoints.find(
        it => it.x === point.x && it.y === point.y
      );
      if (conflict) {
        conflictPoints.push(conflict);
      }
    }

    switch (direction) {
      case "U": {
        initialPoint.up(amount);
        break;
      }
      case "D": {
        initialPoint.down(amount);
        break;
      }
      case "R": {
        initialPoint.right(amount);
        break;
      }
      case "L": {
        initialPoint.left(amount);
        break;
      }
    }
  });

  return Math.min(
    ...conflictPoints.map(it =>
      manhattanDistance(new Point({ x: 0, y: 0 }), it)
    )
  );
};

export const getStepsFrom = (mapping1, mapping2) => {
  let initialPoint = new Point({ x: 0, y: 0 });
  const alreadyWiredPoints = [new Point({ x: 0, y: 0 })];
  const conflictPoints = [];

  mapping1.forEach(command => {
    const [direction, ...amountStr] = command;
    const amount = parseInt(amountStr.join(""), 10);

    switch (direction) {
      case "U": {
        for (let i = 0; i < amount; i++) {
          alreadyWiredPoints.push(
            new Point({
              x: initialPoint.x,
              y: initialPoint.y + i + 1,
              cost: initialPoint.cost + i + 1
            })
          );
        }
        initialPoint.up(amount);
        break;
      }
      case "D": {
        for (let i = 0; i < amount; i++) {
          alreadyWiredPoints.push(
            new Point({
              x: initialPoint.x,
              y: initialPoint.y - (i + 1),
              cost: initialPoint.cost + i + 1
            })
          );
        }
        initialPoint.down(amount);
        break;
      }
      case "R": {
        for (let i = 0; i < amount; i++) {
          alreadyWiredPoints.push(
            new Point({
              x: initialPoint.x + (i + 1),
              y: initialPoint.y,
              cost: initialPoint.cost + i + 1
            })
          );
        }
        initialPoint.right(amount);
        break;
      }
      case "L": {
        for (let i = 0; i < amount; i++) {
          alreadyWiredPoints.push(
            new Point({
              x: initialPoint.x - (i + 1),
              y: initialPoint.y,
              cost: initialPoint.cost + i + 1
            })
          );
        }
        initialPoint.left(amount);
        break;
      }
    }
  });

  initialPoint = new Point({ x: 0, y: 0 });
  mapping2.forEach(command => {
    const [direction, ...amountStr] = command;
    const amount = parseInt(amountStr.join(""), 10);

    for (let i = 0; i < amount; i++) {
      const point = getPointForAmountAndDirection(initialPoint, direction, i);
      const conflict = alreadyWiredPoints.find(
        it => it.x === point.x && it.y === point.y
      );
      if (conflict) {
        conflict.otherCost = initialPoint.cost + i + 1;
        conflictPoints.push(conflict);
      }
    }

    switch (direction) {
      case "U": {
        initialPoint.up(amount);
        break;
      }
      case "D": {
        initialPoint.down(amount);
        break;
      }
      case "R": {
        initialPoint.right(amount);
        break;
      }
      case "L": {
        initialPoint.left(amount);
        break;
      }
    }
  });

  return Math.min(...conflictPoints.map(it => it.cost + it.otherCost));
};

export const computePart1 = items => {
  const part1 = items[0].split(",");
  const part2 = items[1].split(",");
  return getManatthanFrom(part1, part2);
};

export const computePart2 = items => {
  const part1 = items[0].split(",");
  const part2 = items[1].split(",");
  return getStepsFrom(part1, part2);
};

export const run = async part => {
  const data = await parse(`./data/day-03.txt`);
  const result = part === "part1" ? computePart1(data) : computePart2(data);
  return result;
};
