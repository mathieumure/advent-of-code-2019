import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import _ from "lodash";
import { Grid, Point } from "./utils/Space";
import {
  computeIntProgram,
  computeIntProgramWithState
} from "./utils/intProgram";
import { dijkstra } from "./utils/dijkstra";

const asyncReadFile = promisify(readFile);

export const DAY = "17";

export const parse = async path => {
  const data = await asyncReadFile(join(__dirname, path));
  return data
    .toString()
    .split("\n")[0]
    .split(",")
    .map(it => BigInt(it));
};

class MazeGrid extends Grid {
  getOrDefault(x, y) {
    const point = this.get(x, y);
    if (!point || point.type !== "#") {
      return null;
    }
    return point;
  }
  getNeighbors(point) {
    const top = this.getOrDefault(point.x, point.y - 1);
    const right = this.getOrDefault(point.x + 1, point.y);
    const bottom = this.getOrDefault(point.x, point.y + 1);
    const left = this.getOrDefault(point.x - 1, point.y);

    return [top, right, bottom, left].filter(it => it);
  }
}

const EMOJI_BY_TYPE = {
  "#": "⬛️",
  ".": "⬜️",
  "^": "☝️",
  ">": "👉",
  v: "👇",
  "<": "👈"
};

export const computePart1 = items => {
  const grid = new MazeGrid();
  let x = 0;
  let y = 0;

  computeIntProgram(items, [], output => {
    const type = String.fromCharCode(Number(output));
    if (type === "\n") {
      x = 0;
      y++;
      return;
    }
    const point = new Point({ x, y, type });
    grid.push(point);
    x++;
  });

  console.log(grid.prettyPrint(EMOJI_BY_TYPE));

  const scaffolds = grid.getPointsByType("#");
  const scaffoldsIntersections = scaffolds.filter(it => {
    return grid.getNeighbors(it).length === 4;
  });

  return scaffoldsIntersections.reduce((acc, it) => {
    return acc + it.x * it.y;
  }, 0);
};

const getActions = (grid, robot) => {
  let actions = [];
  grid.push(new Point({ ...robot, type: "#" }));
  do {
    const top = grid.get(robot.x, robot.y - 1) || {};
    const right = grid.get(robot.x + 1, robot.y) || {};
    const bottom = grid.get(robot.x, robot.y + 1) || {};
    const left = grid.get(robot.x - 1, robot.y) || {};
    grid.get(robot.x, robot.y).visited = true;

    const updateAction = (top, left, leftType, right, rightType) => {
      if (top.type !== "#") {
        if (right.type === "#") {
          robot = new Point({ ...right, type: rightType });
          actions.push("R");
          actions.push(1);
        }
        if (left.type === "#") {
          robot = new Point({ ...left, type: leftType });
          actions.push("L");
          actions.push(1);
        }
      } else {
        robot = new Point({ ...top, type: robot.type });
        actions[actions.length - 1]++;
      }
    };

    switch (robot.type) {
      case "^": {
        updateAction(top, left, "<", right, ">");
        break;
      }
      case ">": {
        updateAction(right, top, "^", bottom, "v");
        break;
      }
      case "v": {
        updateAction(bottom, right, ">", left, "<");
        break;
      }
      case "<": {
        updateAction(left, bottom, "v", top, "^");
        break;
      }
    }
  } while (grid.getNeighbors(robot).length !== 1);

  return actions;
};

export const computePart2 = items => {
  const grid = new MazeGrid();
  let x = 0;
  let y = 0;
  let robot;

  computeIntProgram(items, [], output => {
    const type = String.fromCharCode(Number(output));
    if (type === "\n") {
      x = 0;
      y++;
      return;
    }
    const point = new Point({ x, y, type });
    grid.push(point);
    x++;
    if (["^", ">", "v", "<"].includes(point.type)) {
      robot = new Point({ ...point });
    }
  });

  console.log(grid.prettyPrint(EMOJI_BY_TYPE));

  const actions = getActions(grid, robot);

  console.log(actions.join(","));

  // TODO Found automatic way to extract function
  const functions = "C,A,A,B,B,C,A,A,B,C\n";
  const A = "L,12,R,4,R,12\n";
  const B = "L,12,L,8,R,10\n";
  const C = "R,4,R,12,R,10,L,12\n";

  const inputStr = functions + A + B + C + 'n\n'
  const input = inputStr.split("").map(it => BigInt(it.charCodeAt(0)))

  items[0] = BigInt(2);
  let result
  computeIntProgram(items, input, output => {
    result = Number(output)
  })

  return result
};

export const run = async part => {
  const data = await parse(`./data/day-${DAY}.txt`);
  return part === "part1" ? computePart1(data) : computePart2(data);
};
