import {readFile} from 'fs'
import {join} from 'path'
import {promisify} from 'util'
import {computeIntProgram, computeIntProgramWithState} from "./utils/intProgram";

const asyncReadFile = promisify(readFile)

const flattenDeep = (arr) => Array.isArray(arr)
    ? arr.reduce( (a, b) => a.concat(flattenDeep(b)) , [])
    : [arr]

export const parse = async path => {
    const data = await asyncReadFile(join(__dirname, path));
    const input = data.toString()
        .split('\n')[0]
        .split('')
        .map(it => parseInt(it, 10));

    return input;
}

class Layer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.pixels = [[]];
        this.currentLine = 0
        this.currentColumn = 0
    }

    get isLastPixelOnLine () {
        return this.currentColumn === this.width
    }

    get isLastPixelOfImage () {
        return this.currentColumn === this.width && this.currentLine === (this.height - 1)
    }

    addPixel (pixel) {
        if (this.isLastPixelOnLine) {
            this.pixels.push([])
            this.currentLine++
            this.currentColumn=0
        }
        this.pixels[this.currentLine].push(pixel)
        this.currentColumn++
    }

    getNbPixelOccurence (pixel) {
        return flattenDeep(this.pixels).filter(it => it === pixel).length
    }
}

export const parseLayers = (width, height) => input => {
    const layers = []
    let currentLayer = new Layer(width, height);

    input.forEach(pixel => {
        currentLayer.addPixel(pixel);
        if (currentLayer.isLastPixelOfImage) {
            layers.push(currentLayer)
            currentLayer = new Layer(width, height)
        }
    })

    return layers
}

export const computePart1 = items => {
    const layers = parseLayers(25,6)(items);
    const layerWithFew0 = layers.reduce((acc, layer) => {
        if (!acc) {
            return layer
        }
        if (layer.getNbPixelOccurence(0) < acc.getNbPixelOccurence(0)) {
            return layer;
        }
        return acc;
    })

    console.log(layerWithFew0)

    return layerWithFew0.getNbPixelOccurence(1) * layerWithFew0.getNbPixelOccurence(2)
}

export const computePart2 = items => {
    const layers = parseLayers(25,6)(items);
    const finalLayer = new Layer(25,6)
    for (let h = 0; h < 6; h++) {
        for (let w = 0; w < 25; w++) {
            const layerUsedForCurrentPixel = layers.find(it => it.pixels[h][w] !== 2)
            finalLayer.addPixel(layerUsedForCurrentPixel.pixels[h][w])
        }
    }
    const str = finalLayer.pixels.reduce((acc, line) => {
        const lineStr = line.map(it => {
            if (it === 0) {
                return " "
            }
            if (it === 1) {
                return "X"
            }
        }).join('')
        return acc + lineStr + '\n'
    }, '')
    console.log(str)
    return finalLayer.pixels
}

export const run = async part => {
    const data = await parse(`./data/day-08.txt`);
    const result = part === 'part1' ? computePart1(data) : computePart2(data)
    return result
}