import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";

const asyncReadFile = promisify(readFile);

export const DAY = "14";

export const parse = async path => {
  const data = await asyncReadFile(join(__dirname, path));
  const input = data.toString().split("\n");

  return input;
};

const parseOperand = operand => {
  const res = /(\d+) (\w+)/gm.exec(operand);

  return { quantity: parseInt(res[1], 10), element: res[2] };
};

class Element {
  constructor({ name, produceQuantity, inputs }) {
    this.name = name;
    this.formuleOutputQuantity = produceQuantity;
    this.formuleInputs = inputs;
  }
}

class Universe {
  constructor() {
    this.elements = {};
  }

  addReaction(output, inputs) {
    this.elements[output.element] = new Element({
      name: output.element,
      produceQuantity: output.quantity,
      inputs
    });
  }

  oreFor(quantity, elementName, surplus = {}) {
    if (elementName === "ORE") {
      return quantity;
    } else if (quantity <= surplus[elementName]) {
      surplus[elementName] -= quantity;
      return 0;
    }
    quantity -= surplus[elementName] ? surplus[elementName] : 0;
    surplus[elementName] = 0;
    let ore = 0;

    const element = this.elements[elementName];
    let nbReactionsNeeded = Math.ceil(quantity / element.formuleOutputQuantity);
    element.formuleInputs.forEach(({ quantity, element }) => {
      ore += this.oreFor(quantity * nbReactionsNeeded, element, surplus);
    });
    surplus[elementName] = surplus[elementName] || 0;
    surplus[elementName] +=
      element.formuleOutputQuantity * nbReactionsNeeded - quantity;
    return ore;
  }
}

export const parseRequest = requests => {
  const universe = new Universe();

  requests.forEach(request => {
    const [inputs, output] = request.split(" => ");
    const inputList = inputs.split(", ");
    const outputItem = parseOperand(output);
    const inputItemList = inputList.map(it => parseOperand(it));
    universe.addReaction(outputItem, inputItemList);
  });

  universe.elements["ORE"] = new Element({ name: "ORE" });

  return universe;
};

export const computePart1 = items => {
  const universe = parseRequest(items);
  return universe.oreFor(1, "FUEL");
};

export const computePart2 = items => {
  const universe = parseRequest(items);
  const MAX_NB_ORE = 1000000000000;

  let done = false;
  let nbFuel;

  let minFuel = 0;
  let maxFuel = MAX_NB_ORE;

  while (!done) {
    if (minFuel > maxFuel) {
      done = true;
      break;
    }

    let nbFuel = Math.floor((maxFuel + minFuel) / 2);

    const nbOre = universe.oreFor(nbFuel, "FUEL");
    if (nbOre < MAX_NB_ORE) {
      minFuel = nbFuel + 1;
    } else if (nbOre > MAX_NB_ORE) {
      maxFuel = nbFuel - 1;
    } else {
      done = true;
      break;
    }
  }

  return maxFuel;
};

export const run = async part => {
  const data = await parse(`./data/day-${DAY}.txt`);
  const result = part === "part1" ? computePart1(data) : computePart2(data);
  return result;
};
