export class Point {
  constructor({ x, y, type }) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  getKey() {
    return this.x + "//" + this.y;
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

export class Grid {
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
    if (!this.data[y]) {
      return null;
    }
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

  getNeighbors(point) {
    const neighbors = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const sideNode = this.get(point.x + i, point.y + j);
        if (sideNode) {
          neighbors.push(sideNode);
        }
      }
    }
    return neighbors;
  }

  prettyPrint(EMOJI_BY_TYPE) {
    const { minX, maxX, minY, maxY } = this.getAllPoints().reduce(
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
    for (let y = maxY; y >= minY; y--) {
      for (let x = minX; x <= maxX; x++) {
        const point = this.get(x, y);
        if (point) {
          line += EMOJI_BY_TYPE[point.type] || "🔲";
        }
      }
      line += "\n";
    }
    return line;
  }
}
