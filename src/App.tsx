import { useState } from 'react'
import Graph from './components/Graph'
import Menu from './components/Menu'
import Footer from './components/Footer';

const App = () => {

  const [graph, setGraph] = useState<GraphType>({ nodes: [], edges: [] });

  return (
    <div className="md:flex md:flex-wrap">
      <Menu setGraph={setGraph} graph={graph} />
      <Graph graph={graph} />
      <Footer/>
    </div>
  )
}

export interface Node {
  id: number,
  x: number,
  y: number,
  fx?: number,
  fy?: number
}

export interface Edge {
  source: number,
  target: number,
  weight: number
}

export interface GraphType {
  nodes: Node[],
  edges: Edge[]
}

export default App