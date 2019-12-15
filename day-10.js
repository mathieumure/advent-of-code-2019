import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import { breadthFirstSearch } from "./utils/BFS";

const asyncReadFile = promisify(readFile);

const keyBy = (array, key) =>
  (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

export const parse = async path => {
  const data = await asyncReadFile(join(__dirname, path));
  const input = data.toString().split("\n");

  return input;
};

export class Node {
  constructor({ x, y, type }) {
    this.x = x;
    this.y = y;
    this.id = `${x}/${y}`;
    this.type = type;
    this.nextNodes = [];
  }

  isAsteroid() {
    return this.type === "#";
  }

  addNextNode(node) {
    const hasAlreadyNodeBetween = this.nextNodes.some(it =>
      it.isBetween(this, node)
    );
    if (!hasAlreadyNodeBetween) {
      this.nextNodes.push(node);
    }
  }

  isBetween(start, end) {
    // horizontal
    if (start.x === end.x) {
      if (this.x !== start.x) {
        return false;
      }
      if (start.y < end.y) {
        return this.y > start.y && this.y < end.y;
      }
      if (start.y > end.y) {
        return this.y < start.y && this.y > end.y;
      }
    }
    // vertical
    if (start.y === end.y) {
      if (this.y !== start.y) {
        return false;
      }
      if (start.x < end.x) {
        return this.x > start.x && this.x < end.x;
      }
      if (start.x > end.x) {
        return this.x < start.x && this.x > end.x;
      }
    }
    // Oblique
    const coefBase = (end.y - start.y) / (end.x - start.x);
    const coef = (this.y - start.y) / (this.x - start.x);
    if (coef === coefBase) {
      if (start.y < end.y && start.x < end.x) {
        return (
          this.y > start.y &&
          this.y < end.y &&
          this.x > start.x &&
          this.x < end.x
        );
      }
      if (start.y < end.y && start.x > end.x) {
        return (
          this.y > start.y &&
          this.y < end.y &&
          this.x < start.x &&
          this.x > end.x
        );
      }
      if (start.y > end.y && start.x < end.x) {
        return (
          this.y < start.y &&
          this.y > end.y &&
          this.x > start.x &&
          this.x < end.x
        );
      }
      if (start.y > end.y && start.x > end.x) {
        return (
          this.y < start.y &&
          this.y > end.y &&
          this.x < start.x &&
          this.x > end.x
        );
      }
    }
  }
}

class Grid {
  constructor() {
    this.data = [];
    this.rawCase = [];
    this.asteroids = [];
  }

  addLine(line) {
    const y = this.data.length;
    const cases = line.split("").map((type, x) => new Node({ x, y, type }));
    this.rawCase = this.rawCase.concat(cases);
    this.asteroids = this.asteroids.concat(cases.filter(it => it.isAsteroid()));
    this.data.push(cases);
  }

  get(x, y) {
    if (this.data[y]) {
      return this.data[y][x];
    }
    return null;
  }

  getNeighbors(node) {
    const neighbors = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const sideNode = this.get(node.x + i, node.y + j);
        if (sideNode) {
          neighbors.push(sideNode);
        }
      }
    }
    return neighbors;
  }

  printItems() {
    return this.data.map(row => {
      return row.map(cell => cell.type).join("");
    });
  }
}

export const findBestAsteroid = (input, grid = new Grid()) => {
  input.forEach(it => grid.addLine(it));

  grid.asteroids.forEach(start => {
    breadthFirstSearch(grid, start, {
      enterVertex: ({ currentVertex }) => {
        if (currentVertex.id === start.id) {
          return null;
        }
        if (currentVertex.isAsteroid()) {
          start.addNextNode(currentVertex);
        }
      }
    });
  });

  return grid.asteroids.reduce((best, asteroid) => {
    if (!best) {
      return asteroid;
    }
    if (asteroid.nextNodes.length > best.nextNodes.length) {
      return asteroid;
    }
    return best;
  }, null);
};

const getAngle = origin => point => {
  if (point.x >= 0 && point.y >= 0) {
    return Math.atan2(origin.y, origin.x) - Math.atan2(point.y, point.x);
  }
  if (point.x >= 0 && point.y < 0) {
    return Math.PI / 2 - Math.atan2(point.y, point.x);
  }
  if (point.x < 0 && point.y < 0) {
    return Math.PI / 2 - Math.atan2(point.y, point.x);
  }
  if (point.x < 0 && point.y >= 0) {
    return Math.PI - Math.atan2(point.y, point.x) + Math.PI + Math.PI / 2;
  }
};

export const computePart1 = items => {
  return findBestAsteroid(items);
};

export const computePart2 = items => {
  let grid = new Grid();
  let orderedDestroyedAsteroid = [];
  let bestAsteroid = findBestAsteroid(items, grid);
  //let bestAsteroid = grid.get(8, 3)
  do {
    const otherAsteroids = bestAsteroid.nextNodes.filter(
      it => it.id !== bestAsteroid.id
    );

    const verticalVector = new Node({ x: 0, y: 4 });
    const getAngleFromOrigin = getAngle(verticalVector);

    const orderedDestroyedAsteroidOfRun = otherAsteroids.sort((ast1, ast2) => {
      const otherVector1 = new Node({
        x: ast1.x - bestAsteroid.x,
        y: bestAsteroid.y - ast1.y
      });
      const angle1 = getAngleFromOrigin(otherVector1);
      const otherVector2 = new Node({
        x: ast2.x - bestAsteroid.x,
        y: bestAsteroid.y - ast2.y
      });
      const angle2 = getAngleFromOrigin(otherVector2);
      return angle1 - angle2;
    });

    orderedDestroyedAsteroidOfRun.forEach(ast => {
      orderedDestroyedAsteroid.push(ast);
      ast.type = ".";
    });
    const newGrid = grid.printItems();
    grid = new Grid();

    findBestAsteroid(newGrid, grid);
    bestAsteroid = grid.get(bestAsteroid.x, bestAsteroid.y);
  } while (grid.asteroids.length > 1);

  return orderedDestroyedAsteroid;
};

export const run = async part => {
  const data = await parse(`./data/day-10.txt`);
  const result = part === "part1" ? computePart1(data) : computePart2(data);
  return result;
};
