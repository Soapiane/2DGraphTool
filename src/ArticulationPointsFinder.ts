class ArticulationPointsFinder {

    private disc: number[];
    private low: number[];
    private parent: number[];
    private articulationPoint: boolean[];
    private vertexNb: number;
    private adjMap: Map<number, number[]>;



    constructor(
        vertexNb: number
    ) {
        this.vertexNb = vertexNb;

        this.disc = new Array(vertexNb).fill(-1)
        this.low = new Array(vertexNb).fill(-1)
        this.parent = new Array(vertexNb).fill(-1)
        this.articulationPoint = new Array(vertexNb).fill(false)

        this.adjMap = new Map<number, number[]>()

        for (let i = 0; i < vertexNb; i++) {
            this.adjMap.set(i, [])
        }


    }


    public addEdge(v: number, w: number) {
        this.adjMap.get(v)!.push(w)
        this.adjMap.get(w)!.push(v)
    }



    public DFS(u: number, time: number = 0) {



        this.disc[u] = this.low[u] = time;
        time += 1;
        let children: number = 0;
        for (let i = 0; i < this.adjMap.get(u)!.length; i++) {
            const v = this.adjMap.get(u)![i]
            if (this.disc[v] === -1) {
                children += 1;
                this.parent[v] = u;
                this.DFS(v, time);
                this.low[u] = Math.min(this.low[u], this.low[v]);

                if (this.parent[u] === -1 && children > 1) {
                    this.articulationPoint[u] = true;
                }

                if (this.parent[u] !== -1 && this.low[v] >= this.disc[u]) {
                    this.articulationPoint[u] = true;
                }

            } else if (v !== this.parent[u]) {
                this.low[u] = Math.min(this.low[u], this.disc[v]);
            }
        }
    }



    public findArticulationPoints() {


        for (let i = 0; i < this.vertexNb; i++) {
            if (this.disc[i] === -1) {
                this.DFS(i)
            }
        }

        const articulationPoints: number[] = []

        this.articulationPoint.forEach((isArticulationPoint, index) => {
            if (isArticulationPoint) {
                articulationPoints.push(index)
            }
        })


        return articulationPoints;

    }

}

// Usage
function main() {
    const g = new ArticulationPointsFinder(5);
    g.addEdge(1, 0);
    g.addEdge(0, 2);
    g.addEdge(2, 1);
    g.addEdge(0, 3);
    g.addEdge(3, 4);
    console.log("Articulation points in first graph ", g.findArticulationPoints());

    const g2 = new ArticulationPointsFinder(4);
    g2.addEdge(0, 1);
    g2.addEdge(1, 2);
    g2.addEdge(2, 3);
    console.log("Articulation points in second graph ", g2.findArticulationPoints());


    const g3 = new ArticulationPointsFinder(7);
    g3.addEdge(0, 1);
    g3.addEdge(1, 2);
    g3.addEdge(2, 0);
    g3.addEdge(1, 3);
    g3.addEdge(1, 4);
    g3.addEdge(1, 6);
    g3.addEdge(3, 5);
    g3.addEdge(4, 5);
    console.log("Articulation points in third graph ", g3.findArticulationPoints());
}

export default ArticulationPointsFinder;