// GraphVisualization.jsx
import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ArticulationPointsFinder from './ArticulationPointsFinder'; // Assurez-vous que le chemin est correct

function GraphVisualization() {
  // Instanciez votre classe et construisez le graphe
  const g = new ArticulationPointsFinder(5);
  g.addEdge(1, 0);


  const articulationPoints = g.findArticulationPoints();

  // Préparez les données pour react-force-graph
  const nodes = [];
  const links = [];

  for (let i = 0; i < g.vertexNb; i++) {
    nodes.push({
      id: i,
      isArticulationPoint: articulationPoints.includes(i),
    });
  }

  g.adjMap.forEach((neighbors, node) => {
    neighbors.forEach((neighbor) => {
      // Évitez les doublons en vérifiant que source < target
      if (node < neighbor) {
        links.push({ source: node, target: neighbor });
      }
    });
  });

  const graphData = { nodes, links };

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeAutoColorBy="isArticulationPoint"
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = node.id;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;

        // Colorez les points d'articulation en rouge
        ctx.fillStyle = node.isArticulationPoint ? 'red' : 'blue';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
        ctx.fill();

        // Affichez les labels des nœuds
        ctx.fillStyle = 'black';
        ctx.fillText(label, node.x + 6, node.y + 6);
      }}
    />
  );
}

export default GraphVisualization;
