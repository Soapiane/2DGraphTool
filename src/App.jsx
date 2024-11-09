// App.jsx
import React, { useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import Background from "./assets/background.jpg";

// Votre classe ArticulationPointsFinder reste la même
class ArticulationPointsFinder {
  constructor(vertexNb) {
    this.vertexNb = vertexNb;
    this.disc = new Array(vertexNb).fill(-1);
    this.low = new Array(vertexNb).fill(-1);
    this.parent = new Array(vertexNb).fill(-1);
    this.articulationPoint = new Array(vertexNb).fill(false);
    this.adjMap = new Map();

    for (let i = 0; i < vertexNb; i++) {
      this.adjMap.set(i, []);
    }
  }

  addEdge(v, w) {
    if (
      typeof v !== 'number' ||
      typeof w !== 'number' ||
      v < 0 ||
      w < 0 ||
      v >= this.vertexNb ||
      w >= this.vertexNb
    ) {
      throw new Error(`Les paramètres v et w doivent être des nombres valides, reçus v: ${v}, w: ${w}`);
    }
    this.adjMap.get(v).push(w);
    this.adjMap.get(w).push(v);
  }

  DFS(u, time = { value: 0 }) {
    this.disc[u] = this.low[u] = time.value;
    time.value += 1;
    let children = 0;
    for (let i = 0; i < this.adjMap.get(u).length; i++) {
      const v = this.adjMap.get(u)[i];
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

  findArticulationPoints() {
    for (let i = 0; i < this.vertexNb; i++) {
      if (this.disc[i] === -1) {
        this.DFS(i, { value: 0 });
      }
    }

    const articulationPoints = [];

    this.articulationPoint.forEach((isArticulationPoint, index) => {
      if (isArticulationPoint) {
        articulationPoints.push(index);
      }
    });

    return articulationPoints;
  }
}

function App() {
  const [vertexNb, setVertexNb] = useState('');
  const [edges, setEdges] = useState([{ from: '', to: '' }]);
  const [graphData, setGraphData] = useState(null);
  const [articulationPoints, setArticulationPoints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fgRef = useRef();

  const handleVertexNbChange = (e) => {
    setVertexNb(e.target.value);
  };

  const handleEdgeChange = (index, field, value) => {
    const newEdges = [...edges];
    newEdges[index][field] = value;

    if (
      newEdges[index].from !== '' &&
      newEdges[index].to !== '' &&
      index === newEdges.length - 1
    ) {
      newEdges.push({ from: '', to: '' });
    }

    setEdges(newEdges);
  };

  const generateGraph = () => {
    const n = parseInt(vertexNb);
    if (isNaN(n) || n <= 0) {
      alert('Veuillez entrer un nombre valide de sommets.');
      return;
    }

    const g = new ArticulationPointsFinder(n);

    const validEdges = [];

    for (let edge of edges) {
      const from = parseInt(edge.from);
      const to = parseInt(edge.to);

      if (!isNaN(from) && !isNaN(to)) {
        try {
          g.addEdge(from, to);
          validEdges.push({ source: from, target: to });
        } catch (error) {
          alert(`Erreur lors de l'ajout de l'arête (${from}, ${to}): ${error.message}`);
          return;
        }
      }
    }

    const articulationPoints = g.findArticulationPoints();

    const nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        id: i,
        isArticulationPoint: articulationPoints.includes(i),
      });
    }

    setGraphData({ nodes, links: validEdges });
    setArticulationPoints(articulationPoints);

    if (fgRef.current) {
      fgRef.current.d3ReheatSimulation();
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-[url('./assets/background.jpg')] h-screen w-screen bg-cover bg-center flex align-middle justify-center flex-col">
      <div className="container mx-auto p-4 max-w-[600px] bg-white rounded-lg shadow-lg h-fit">
  <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700 ">
    Visualisation du Graphe avec Points d'Articulation
  </h1>

  {/* Formulaire pour le nombre de sommets */}
  <div className="mb-6">
    <label className="block text-gray-600 font-medium">
      Nombre de sommets :
      <input
        type="number"
        value={vertexNb}
        onChange={handleVertexNbChange}
        min="1"
        className="mt-2 block w-full border border-indigo-200 rounded-lg p-3 focus:border-indigo-500 transition duration-200"
      />
    </label>
  </div>

  {/* Formulaire dynamique pour les arêtes */}
  <h2 className="text-xl font-semibold mb-4 text-indigo-600">Arêtes :</h2>
  {edges.map((edge, index) => (
    <div key={index} className="flex items-center mb-3 space-x-4 justify-between">
      <label className="flex items-center text-gray-700">
        <span className="mr-2 text-sm">Entre :</span>
        <input
          type="number"
          value={edge.from}
          onChange={(e) => handleEdgeChange(index, 'from', e.target.value)}
          min="0"
          className="w-20 border border-gray-300 rounded-lg p-2 focus:border-indigo-500 transition duration-200"
        />
      </label>
      <label className="flex items-center text-gray-700">
        <span className="mr-2 text-sm">Et :</span>
        <input
          type="number"
          value={edge.to}
          onChange={(e) => handleEdgeChange(index, 'to', e.target.value)}
          min="0"
          className="w-20 border border-gray-300 rounded-lg p-2 focus:border-indigo-500 transition duration-200"
        />
      </label>
    </div>
  ))}

  {/* Bouton pour générer le graphe */}
  <button
    onClick={generateGraph}
    className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 shadow-md"
  >
    Générer le graphe
  </button>


      {/* Modal pour afficher le graphe */}
      {showModal && graphData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gray-800 opacity-75"
            onClick={closeModal}
          ></div>

          {/* Contenu du modal */}
          <div className="relative bg-white rounded-lg overflow-hidden shadow-lg z-50 max-w-xl w-full flex flex-col items-center">
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold mb-4 text-center">
                Graphe Généré
              </h2>
              <div className="w-full flex justify-center">
                <div className="w-full h-96">
                  <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                      const label = node.id;
                      const fontSize = 12 / globalScale;
                      ctx.font = `${fontSize}px Sans-Serif`;

                      // Définir la couleur du nœud
                      if (node.isArticulationPoint) {
                        ctx.fillStyle = 'red';
                      } else {
                        ctx.fillStyle = 'blue';
                      }

                      // Dessiner le nœud
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
                      ctx.fill();

                      // Afficher le label du nœud
                      ctx.fillStyle = 'black';
                      ctx.fillText(label, node.x + 6, node.y + 6);
                    }}
                    width={600} // Largeur fixe pour le graphe
                    height={400} // Hauteur fixe pour le graphe
                  />
                </div>
              </div>
            </div>
            <div className="p-4 w-full text-right">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    </div>

  );
}

export default App;
