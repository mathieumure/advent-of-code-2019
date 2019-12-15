import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import { computeIntProgram } from "./utils/intProgram";

const asyncReadFile = promisify(readFile);

export const parse = async path => {
  const data = await asyncReadFile(join(__dirname, path));
  const input = data
    .toString()
    .split("\n")[0]
    .split(",")
    .map(it => BigInt(it));

  return input;
};

const EMOJI_BY_TYPE = {
  0: "⬜️",
  1: "⬛️",
  2: "🟫",
  3: "🟦",
  4: "🔵"
};

class Point {
  constructor({ x, y, type }) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

class Grid {
  constructor() {
    this.data = [];
  }

  push(point) {
    if (!this.data[point.y]) {
      this.data[point.y] = [];
    }
    this.data[point.y][point.x] = point;
  }

  get(x, y) {
    return this.data[y][x];
  }

  getAllPoints() {
    const points = [];
    this.data.forEach(line => {
      line.forEach(point => {
        points.push(point);
      });
    });
    return points;
  }

  isComplete() {
    return this.data.length === 23 && this.data[22].length === 43;
  }
}

const prettyPrint = grid => {
  const { minX, maxX, minY, maxY } = grid.getAllPoints().reduce(
    (acc, point) => {
      return {
        minX: point.x < acc.minX ? point.x : acc.minX,
        minY: point.y < acc.minY ? point.y : acc.minY,
        maxX: point.x > acc.maxX ? point.x : acc.maxX,
        maxY: point.y > acc.maxY ? point.y : acc.maxY
      };
    },
    {
      minX: Number.MAX_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER
    }
  );

  let line = "";
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const point = grid.get(x, y);
      if (point) {
        line += EMOJI_BY_TYPE[point.type];
      }
    }
    line += "\n";
  }
  return line;
};

export const computePart1 = items => {
  let outputs = [];
  const points = [];
  computeIntProgram(items, [], out => {
    outputs.push(out);
    if (outputs.length === 3) {
      const [x, y, type] = outputs;
      points.push(
        new Point({ x: Number(x), y: Number(y), type: Number(type) })
      );
      outputs = [];
    }
  });

  const grid = prettyPrint(points);

  return points.filter(it => it.type === 2).length;
};

const JOYSTICK = {
  NEUTRAL: BigInt(0),
  LEFT: BigInt(-1),
  RIGHT: BigInt(1)
};

export const computePart2 = items => {
  let outputs = [];
  const grid = new Grid();
  let score;
  let first = true;
  items[0] = BigInt(2);
  let lastBallPosition;
  let canMove = false;
  computeIntProgram(items, [], out => {
    outputs.push(out);
    if (outputs.length === 3) {
      const [xBigInt, yBigInt, typeBigInt] = outputs;
      const x = Number(xBigInt);
      const y = Number(yBigInt);
      const type = Number(typeBigInt);
      let action;

      if (x === -1 && y === 0) {
        score = type;
        const gridStr = prettyPrint(grid);
        console.log("SCORE::: " + score);
        console.log(gridStr);
      } else {
        grid.push(new Point({ x, y, type }));
      }

      if (grid.isComplete()) {
        if (type === 4 || type === 3) {
          const gridStr = prettyPrint(grid);
          console.log("SCORE::: " + score);
          console.log(gridStr);
        }

        if (type) {
          action = JOYSTICK.NEUTRAL;
        }

        if (type === 4) {
          const ball = grid.getAllPoints().find(it => it.type === 4);
          const paddle = grid.getAllPoints().find(it => it.type === 3);
          const isBallMovingDown = lastBallPosition.y < ball.y;
          const isBallMovingRight = lastBallPosition.x < ball.x;

          if (!canMove) {
            canMove = ball.x === paddle.x;
          } else if (ball.x < paddle.x) {
            action = JOYSTICK.LEFT;
          } else if (ball.x > paddle.x) {
            action = JOYSTICK.RIGHT;
          }

          lastBallPosition = { x: ball.x, y: ball.y };
        }
      } else if (type === 4) {
        lastBallPosition = { x, y };
      }

      outputs = [];
      if (type === 4) {
        return action;
      }
      // process.stdout.write('\x1b[2J');
    }
  });

  return score;
};

export const run = async part => {
  const data = await parse(`./data/day-13.txt`);
  const result = part === "part1" ? computePart1(data) : computePart2(data);
  return result;
};
