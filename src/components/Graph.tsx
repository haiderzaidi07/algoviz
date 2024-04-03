import { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import demoGraph from '../demoGraph';
import { GraphType, Node } from '../App';

interface Props {
  graph: GraphType
}

const Graph: FC<Props> = ({ graph }) => {

  const svgRef = useRef(null);

  useEffect(() => {
    (graph === null) ? renderGraph(demoGraph) : renderGraph(graph)
  }, [graph]);

  const renderGraph = (graph: GraphType) => {

    const width = 800;
    const height = 600;

    const nodes = graph.nodes.map(d => ({ ...d }));
    const edges = graph.edges.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => Number(d.index)))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX().strength(0)) // Disable the force in the x direction
      .force("y", d3.forceY().strength(0)) // Disable the force in the y direction;

    // Set the initial position of each node
    nodes.forEach(node => {
      node.fx = node.x;
      node.fy = node.y;
    });

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const edge = svg.append("g")
      .attr("stroke", "#EAEAEA")
      .attr("stroke-opacity", 0.8)
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke-width", 2);

    const edgeLabels = svg.selectAll("text.edge-label")
      .data(edges)
      .enter().append("text")
      .attr("class", "edge-label")
      .attr("cursor", "default")
      .style("user-select", "none")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .text(d => d.weight)
      .attr('fill', '#EAEAEA');

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("cursor", "pointer")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", '#08D9D6');

    node.append("title")
      .text(d => `id: ${d.id}`);

      node.call(
        d3.drag<any, any, any>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );
      
    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
      edge
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      edgeLabels
        .attr('x', (d: any) => ((d.source.x + 10) + (d.target.x + 10)) / 2)
        .attr('y', (d: any) => ((d.source.y + 10) + (d.target.y + 10)) / 2)
    });


    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.5).restart();
  
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      (event.subject as Node).fx = undefined;
      (event.subject as Node).fy = undefined;
    }

    return svg.node();
  }

  return (
    <div className="md:w-[75%] flex items-center justify-center">
      <svg ref={svgRef} className="w-[90%] h-[90%] p-[5%]"></svg>
    </div>
  )
};

export default Graph;