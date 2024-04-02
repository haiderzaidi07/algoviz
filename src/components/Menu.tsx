import { ChangeEvent, FC, useEffect, useState } from "react"
import { Edge, GraphType, Node } from "../App";

interface Props {
  setGraph: React.Dispatch<React.SetStateAction<GraphType>>,
  graph: GraphType
}

const Menu: FC<Props> = ({ setGraph, graph }) => {

  const [input, setInput] = useState(0)
  const [type, setType] = useState("")
  const [selectedInputOption, setSelectedInputOption] = useState("");
  const [selectedTypeOption, setSelectedTypeOption] = useState("");
  const [showError, setShowError] = useState({ input: false, type: false });
  const [runningTime, setRunningTime] = useState(0);

  useEffect(() => {
    generateRandomGraph(10, 'sparse')
  }, [])

  const inputSize = (event: ChangeEvent<HTMLInputElement>) => {

    const value = event.target.value;
    setSelectedInputOption(value);

    switch (value) {
      case 'five':
        setInput(5)
        break;
      case 'ten':
        setInput(10)
        break;
      case 'fifty':
        setInput(50)
        break;
      case 'hundred':
        setInput(100)
        break;
      case 'twofifty':
        setInput(250)
        break;
      default:
    }
  };

  const inputType = (event: ChangeEvent<HTMLInputElement>) => {
    
    const value = event.target.value;
    setSelectedTypeOption(value);

    switch (value) {
      case 'sparse':
        setType('sparse')
        break;
      case 'dense':
        setType('dense')
        break;
      default:
        console.log('Unknown option selected');
    }
  };

  const generateRandomGraph = (n: number, graphType: string) => {
    if (!n) {
      setShowError({ input: true, type: false })
      return;
    }
    
    if (!graphType) {
      setShowError({ input: false, type: true })
      return;
    }
  
    const nodes: Node[] = [];
    const edges: string[] = []; 
    const sparseDenseBoundary = 0.5 * 0.5 * n * (n - 1);
    let numOfEdges = 0;
  
    if (graphType === 'sparse') {
      numOfEdges = Math.floor(Math.random() * (sparseDenseBoundary - (n - 1) + 1)) + (n - 1);
    } else if (graphType === 'dense') {
      numOfEdges = Math.floor(Math.random() * (((n * (n - 1)) / 2) - sparseDenseBoundary + 1)) + sparseDenseBoundary;
    }
  
    // Generate nodes
    for (let i = 0; i < n; i++) {
      nodes.push({ id: i, x: Math.random() * 800, y: Math.random() * 600 });
    }
  
    // Create edges randomly while ensuring no more than one edge between nodes
    while (edges.length < numOfEdges) {
      const sourceIndex = Math.floor(Math.random() * n);
      const targetIndex = Math.floor(Math.random() * n);
  
      if (sourceIndex !== targetIndex) {
        const edgeKey = `${sourceIndex}-${targetIndex}`;
  
        // Check if edge already exists
        if (!edges.includes(edgeKey) && !edges.includes(`${targetIndex}-${sourceIndex}`)) {
          edges.push(edgeKey);
        }
      }
    }
  
    // Convert edge keys to edge objects
    const edgeList = edges.map(edge => {
      const [sourceId, targetId] = edge.split('-');

        return {
          source: Number(sourceId),
          target: Number(targetId),
          weight: Math.floor(Math.random() * 30) + 1
        };
      })
    .filter(edge => edge !== null) as Edge[];

    const graphData = { nodes, edges: edgeList };
  
    setGraph(graphData);
    setShowError({ input: false, type: false })
  };
  

  const KruskalAlgo = () => {
    
    if (graph) {
      const startTime = performance.now()

      const find = (node: number, parent: { [key: number]: number }): number => {
        if (parent[node] === node) return node;
        return find(parent[node], parent);
      };
      
      // Helper function to merge two sets
      const union = (x: number, y: number, parent: { [key: number]: number }, rank: { [key: number]: number }) => {
        const xRoot = find(x, parent);
        const yRoot = find(y, parent);

        if (rank[xRoot] < rank[yRoot]) {
          parent[xRoot] = yRoot;
        } else if (rank[xRoot] > rank[yRoot]) {
          parent[yRoot] = xRoot;
        } else {
          parent[yRoot] = xRoot;
          rank[xRoot]++;
        }
      };

      const edges = graph.edges.slice(); // Clone the edges array
      edges.sort((a, b) => a.weight - b.weight); // Sort edges by weight
    
      const numOfNodes = graph.nodes.length;
      const parent: { [key: number]: number } = {};
      const rank: { [key: number]: number } = {};
    
      // Initialize each node as its own set
      for (let i = 0; i < numOfNodes; i++) {
        parent[i] = i;
        rank[i] = 0;
      }
    
      const mstEdges = [];
      let edgeIndex = 0;
    
      // Construct MST
      while (mstEdges.length < numOfNodes - 1) {
        const { source, target, weight } = edges[edgeIndex++];
    
        const x = find(source, parent);
        const y = find(target, parent);
    
        if (x !== y) {
          mstEdges.push({ source, target, weight });
          union(x, y, parent, rank);
        }
      }
  
      const endTime = performance.now()
      setRunningTime(Number((endTime - startTime).toFixed(6)))

      console.log(`Kruskal's algorithm took ${runningTime} milliseconds`);
      console.log("MST Edges: ", mstEdges); 

      setGraph({...graph, edges: mstEdges})
    }
  };

  const PrimAlgo = () => {
    if (graph) {
      const startTime = performance.now();
  
      const numOfNodes = graph.nodes.length;
      const parent = new Array(numOfNodes).fill(-1);
      const key = new Array(numOfNodes).fill(Infinity);
      const mstEdges = [];
  
      const minKeyIndex = (key: number[], mstSet: boolean[]) => {

        let min = Infinity;
        let minIndex = -1;
  
        for (let v = 0; v < numOfNodes; v++) {
          if (!mstSet[v] && key[v] < min) {
            min = key[v];
            minIndex = v;
          }
        }
  
        return minIndex;
      };
  
      key[0] = 0; // Start from the first node
  
      for (let count = 0; count < numOfNodes - 1; count++) {
        const u = minKeyIndex(key, mstEdges);
        mstEdges[u] = true;
  
        for (let v = 0; v < numOfNodes; v++) {
          const edge = graph.edges.find(
            (edge) =>
              (edge.source === u && edge.target === v) ||
              (edge.source === v && edge.target === u)
          );
  
          if (edge && !mstEdges[v] && edge.weight < key[v]) {
            parent[v] = u;
            key[v] = edge.weight;
          }
        }
      }
  
      const mst = [];
      for (let i = 1; i < numOfNodes; i++) {
        const source = parent[i];
        const target = i;
        const weight = key[i];
        mst.push({ source, target, weight });
      }
  
      const endTime = performance.now();
      setRunningTime(Number((endTime - startTime).toFixed(6)))
  
      console.log(`Prim's algorithm took ${runningTime} milliseconds`);
      console.log("MST Edges: ", mst); 
  
      setGraph({...graph, edges: mst})
    }
  };

  return (
    <div className="px-10 pt-10 md:w-[25%]">
      <div className="flex items-center">
        <img src="./algovizlogo.svg" alt="logo" />
        <h1 className="font-primary text-txt text-5xl ml-3">AlgoViz</h1>
      </div>
      <legend className="heading mt-12 mb-3">Number of Nodes:</legend>
      <div className="inputgroup">
        <input
          type="radio"
          id="five"
          name="nodes"
          value="five"
          checked={selectedInputOption === 'five'}
          onChange={inputSize}
          className="radio"
          />
        <label htmlFor="five" className="option">5</label>
      </div>
      <div className="inputgroup">
        <input
          type="radio"
          id="ten"
          name="nodes"
          value="ten"
          checked={selectedInputOption === 'ten'}
          onChange={inputSize}
          className="radio"
          />
        <label htmlFor="ten" className="option">10</label>
      </div>
      <div className="inputgroup">
        <input
          type="radio"
          id="fifty"
          name="nodes"
          value="fifty"
          checked={selectedInputOption === 'fifty'}
          onChange={inputSize}
          className="radio"
          />
        <label htmlFor="fifty" className="option">50</label>
      </div>
      <div className="inputgroup">
        <input
          type="radio"
          id="hundred"
          name="nodes"
          value="hundred"
          checked={selectedInputOption === 'hundred'}
          onChange={inputSize}
          className="radio"
          />
        <label htmlFor="hundred" className="option">100</label>
      </div>
      <div className="inputgroup">
        <input
          type="radio"
          id="twofifty"
          name="nodes"
          value="twofifty"
          checked={selectedInputOption === 'twofifty'}
          onChange={inputSize}
          className="radio"
          />
        <label htmlFor="twofifty" className="option">250</label>
      </div>
      <legend className="heading mt-5 mb-3">Type:</legend>
      <div>
        <div className="inputgroup">
          <input
            type="radio"
            id="sparse"
            name="type"
            value="sparse"
            checked={selectedTypeOption === 'sparse'}
            onChange={inputType}
            className="radio"
            />
          <label htmlFor="sparse" className="option">Sparse</label>
        </div>
        <div className="inputgroup">
          <input
            type="radio"
            id="dense"
            name="type"
            value="dense"
            checked={selectedTypeOption === 'dense'}
            onChange={inputType}
            className="radio"
            />
          <label htmlFor="dense" className="option">Dense</label>
        </div>
      </div>
      <button className="btn bg-custblue hover:drop-shadow-blue" type="button" onClick={() => generateRandomGraph(input, type)}>Generate Graph</button>
      { showError.input ? 
        (<h4 className="text-custred text-sm">Please choose Number of Nodes</h4>) 
        : showError.type ? 
        (<h4 className="text-custred text-sm">Please choose the Type</h4>) 
        : null 
      }
      <h3 className="heading mt-3">Choose Algorithm:</h3>
      <button className="btn bg-custblue mr-4 hover:drop-shadow-blue" type="button" onClick={KruskalAlgo}>Run Kruskal's</button>
      <button className="btn bg-custred hover:drop-shadow-red" type="button" onClick={PrimAlgo}>Run Prim's</button>
      <h4 className="font-primary text-txt text-xl mt-5">Running Time: <span className="font-secondary text-txt text-lg">{runningTime} milliseconds</span></h4>
    </div>
  );
}

export default Menu