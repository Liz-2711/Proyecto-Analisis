class ColoringGraphs {
    constructor(V) {
        if (typeof V !== "number" || V <= 0) {
            throw new Error("Invalid number of vertices. V must be a positive number.");
        }

        this.V = V;
        this.adjList = Array.from({ length: V }, () => []); 
    }

    addEdge(v, w) {
        if (v < 0 || v >= this.V || w < 0 || w >= this.V) {
            throw new Error(`Invalid edge: [${v}, ${w}]. Vertices must be in range 0 to ${this.V - 1}.`);
        }

        this.adjList[v].push(w);
        this.adjList[w].push(v); 
    }

    isConnected() {
        if (this.V === 0) return false;

        const visited = Array(this.V).fill(false);

        const dfs = (node) => {
            visited[node] = true;
            for (const neighbor of this.adjList[node]) {
                if (!visited[neighbor]) dfs(neighbor);
            }
        };

        dfs(0);

        return visited.every((node, idx) => node || this.adjList[idx].length === 0);
    }

    graphColoring(numColors) {
        const result = Array(this.V).fill(-1);
        const steps = [];
        const colorUsage = new Array(numColors).fill(0); 
        const isSafe = (node, color) => {
            for (const neighbor of this.adjList[node]) {
                if (result[neighbor] === color) return false;
            }
            return true;
        };
    
        const colorGraph = (node) => {
            if (node === this.V) {
         
                const usedColors = new Set(result);
                return usedColors.size >= numColors; 
            }
            for (let c = 0; c < numColors; c++) {
                if (isSafe(node, c)) {
                    result[node] = c;
                    colorUsage[c] += 1; 
                    steps.push({
                        vertex: node,
                        color: c,
                        action: "assign",
                        message: `Node ${node} is assigned color ${c}`,
                        result: [...result],
                    });
    
                    if (colorGraph(node + 1)) return true;
                    // Backtracking
                    steps.push({
                        vertex: node,
                        color: c,
                        action: "unassign",
                        message: `Backtracking: Unassigning color ${c} from node ${node}`,
                        result: [...result],
                    });
                    colorUsage[c] -= 1; 
                    result[node] = -1;
                }
            }
    
            return false;
        };
    
        // Start coloring process
        const success = colorGraph(0);
    
        
        if (!success || new Set(result).size < numColors) {
            steps.push({
                message: `Graph cannot be fully colored with all ${numColors} colors. Adjust input or graph structure.`,
            });
            return { success: false, steps };
        }
    
        return { success, steps };
    }
    
    
}

module.exports = ColoringGraphs;
