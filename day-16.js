import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import { Grid, Point } from "./utils/Space";
import { computeIntProgramWithState } from "./utils/intProgram";
import depthFirstSearch from "./utils/DFS";

const asyncReadFile = promisify(readFile);

export const DAY = "16";

export const parse = async path => {
  const data = await asyncReadFile(join(__dirname, path));
  return data.toString().split("\n")[0];
};

export const getPattern = (basePattern, outputLength, iterationNb) => {
  const pattern = [];
  for (let i = 0; i < outputLength + 1; i++) {
    const basePatternIndex =
      Math.floor(i / (iterationNb + 1)) % basePattern.length;
    pattern.push(basePattern[basePatternIndex]);
  }
  return pattern.slice(1);
};

export const getPatternNumber = (basePattern, iterationNb, index) => {
  const basePatternIndex =
    Math.floor((index + 1) / (iterationNb + 1)) % basePattern.length;

  return basePattern[basePatternIndex];
};

export const nextSignal = (pattern, signal) => {
  let next = "";
  for (let i = 0; i < signal.length; i++) {
    let sum = 0;
    for (let j = i; j < signal.length; j++) {
      let currentNumber = Number(signal.charAt(j));
      sum += currentNumber * getPatternNumber(pattern, i, j);
    }
    next += Math.abs(sum % 10);
  }
  return next;
};

export const iterateThroughPhase = (pattern, signal, nbPhases) => {
  let next = signal;
  for (let i = 0; i < nbPhases; i++) {
    next = nextSignal(pattern, next);
    console.log("Phase " + i + " is done!");
  }
  return next;
};

export const computePart1 = items => {
  const pattern = [0, 1, 0, -1];
  return iterateThroughPhase(pattern, items, 100).slice(0, 8);
};

export const computePart2 = items => {
  const offset = Number(items.slice(0, 7));
  const nbRepeatFromOffsetToEnd = Math.ceil(
    (items.length * 10000 - offset) / items.length
  );
  const inputFromOffsetToEnd = items
    .repeat(nbRepeatFromOffsetToEnd)
    .slice(offset % items.length)
    .split("")
    .map(Number);

  for (let i = 0; i < 100; i++) {
    for (let j = inputFromOffsetToEnd.length - 2; j >= 0; j--) {
      const digit =
        Number(inputFromOffsetToEnd[j]) + Number(inputFromOffsetToEnd[j + 1]);
      inputFromOffsetToEnd[j] = Math.abs(digit) % 10;
    }
  }

  return inputFromOffsetToEnd.slice(0, 8).join("");
};

export const run = async part => {
  const data = await parse(`./data/day-${DAY}.txt`);
  return part === "part1" ? computePart1(data) : computePart2(data);
};
