import {readFile} from 'fs'
import {join} from 'path'
import {promisify} from 'util'
import PriorityQueue from "./utils/PriorityQueue";

const asyncReadFile = promisify(readFile)

export const parse = async path => {
    const data = await asyncReadFile(join(__dirname, path));
    const input = data.toString()
        .split('\n');

    return input;
}

class Orbit {
    constructor({id}) {
        this.id = id;
        this.nextOrbits = []
    }

    getNeighbors() {
        return this.nextOrbits;
    }

    addOrbit(orbit) {
        if (!this.nextOrbits.map(it => it.id).includes(orbit.id)) {
            this.nextOrbits.push(orbit)
        }
    }

    getNbOrbits () {
        const directOrbits = this.nextOrbits.length;
        const indirectOrbits = this.nextOrbits.reduce((acc, it) => acc + it.getNbOrbits(), 0)
        return indirectOrbits + directOrbits;
    }

    toString () {
        return `[${this.id}] => { ${this.nextOrbits.map(it => it.id).join(',')} }`
    }
}

const getOrCreateOrbits = (orbits, id) => {
    if (!orbits[id]) {
        orbits[id] = new Orbit({id})
    }
    return orbits[id]
}

export const parseOrbits = (orbitsInfo, twoWay) => {
    const orbits = {}
    orbitsInfo.forEach(orbitInfo => {
        const [center, orbital] = orbitInfo.split(')');
        const centerOrbit = getOrCreateOrbits(orbits, center);
        const orbitalOrbit = getOrCreateOrbits(orbits, orbital);
        orbitalOrbit.addOrbit(centerOrbit);
        if (twoWay) {
            centerOrbit.addOrbit(orbitalOrbit);
        }
    })
    return orbits;
}

const dijkstra = (graph, startVertex) => {
    const distances = {};
    const visitedVertices = {};
    const previousVertices = {};
    const queue = new PriorityQueue();

    // Init all distances with infinity assuming that currently we can't reach
    // any of the vertices except the start one.
    Object.values(graph).forEach((vertex) => {
        distances[vertex.id] = Infinity;
        previousVertices[vertex.id] = null;
    });

    // We are already at the startVertex so the distance to it is zero.
    distances[startVertex.id] = 0;

    // Init vertices queue.
    queue.add(startVertex, distances[startVertex.id]);

    // Iterate over the priority queue of vertices until it is empty.
    while (!queue.isEmpty()) {
        // Fetch next closest vertex.
        const currentVertex = queue.poll();

        // Iterate over every unvisited neighbor of the current vertex.
        currentVertex.getNeighbors().forEach((neighbor) => {
            // Don't visit already visited vertices.
            if (!visitedVertices[neighbor.id]) {
                const weight = 1

                const existingDistanceToNeighbor = distances[neighbor.id];
                const distanceToNeighborFromCurrent = distances[currentVertex.id] + weight;

                // If we've found shorter path to the neighbor - update it.
                if (distanceToNeighborFromCurrent < existingDistanceToNeighbor) {
                    distances[neighbor.id] = distanceToNeighborFromCurrent;

                    // Change priority of the neighbor in a queue since it might have became closer.
                    if (queue.hasValue(neighbor)) {
                        queue.changePriority(neighbor, distances[neighbor.id]);
                    }

                    // Remember previous closest vertex.
                    previousVertices[neighbor.id] = currentVertex;
                }

                // Add neighbor to the queue for further visiting.
                if (!queue.hasValue(neighbor)) {
                    queue.add(neighbor, distances[neighbor.id]);
                }
            }
        });

        // Add current vertex to visited ones to avoid visiting it again later.
        visitedVertices[currentVertex.id] = currentVertex;
    }

    // Return the set of shortest distances to all vertices and the set of
    // shortest paths to all vertices in a graph.
    return {
        distances,
        previousVertices,
    };
}

export const computePart1 = items => {
    const orbits = parseOrbits(items, false)
    return Object.values(orbits).reduce((acc, it) => acc + it.getNbOrbits(), 0)
}

export const computePart2 = items => {
    const orbits = parseOrbits(items, true)
    const {distances} = dijkstra(orbits, orbits['YOU']);
    return distances['SAN'] - 2;
}

export const run = async part => {
    const data = await parse(`./data/day-06.txt`);
    const result = part === 'part1' ? computePart1(data) : computePart2(data)
    return result
}