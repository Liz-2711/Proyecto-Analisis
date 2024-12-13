import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import '../App.css';

const alpha = 1;
const beta = 5;
const evaporationRate = 0.5;
const Q = 100;
const antCount = 30;
const iterations = 100;

function TravellingSalesman() {
  const [cities, setCities] = useState([]);
  const [pheromone, setPheromone] = useState([]);
  const [distanceMatrix, setDistanceMatrix] = useState([]);

  useEffect(() => {
    initialize(); // Cuando las ciudades cambian, se reinician las matrices
  }, [cities]);

  const addCity = (event) => {
    event.preventDefault();
    const cityName = event.target.cityName.value;
    const cityX = parseInt(event.target.cityX.value);
    const cityY = parseInt(event.target.cityY.value);
    
    setCities([...cities, { name: cityName, x: cityX, y: cityY }]);
    event.target.reset();
  };

  const initialize = () => {
    const pheromoneMatrix = [];
    const distanceMatrix = [];
    
    for (let i = 0; i < cities.length; i++) {
      pheromoneMatrix[i] = [];
      distanceMatrix[i] = [];
      for (let j = 0; j < cities.length; j++) {
        pheromoneMatrix[i][j] = 1;  // Inicializa feromonas con 1
        distanceMatrix[i][j] = calculateCityDistance(cities[i], cities[j]);
      }
    }
    
    setPheromone(pheromoneMatrix);
    setDistanceMatrix(distanceMatrix);
    updateGraph(); // Actualiza el gráfico cuando las ciudades cambian
  };

  const calculateCityDistance = (city1, city2) => {
    return Math.sqrt(Math.pow(city1.x - city2.x, 2) + Math.pow(city1.y - city2.y, 2));
  };

  const runTSPHybrid = () => {
    if (cities.length < 2) {
      alert("Please add at least two cities.");
      return;
    }

    const finalRoute = tspHybridClustering(cities, 3); // Example with 3 clusters
    visualizeRouteStepByStep(finalRoute);
  };

  const tspHybridClustering = (cities, k) => {
    const clusters = kMeansClustering(cities, k);
    const optimizedClusters = clusters.map(cluster => {
      const route = nearestNeighbor(cluster);
      return twoOpt(route);
    });
    const globalRoute = connectClusters(optimizedClusters);
    const finalRoute = simulatedAnnealing(globalRoute);
    return finalRoute;
  };

  const kMeansClustering = (cities, k) => {
    const clusters = Array.from({ length: k }, () => []);
    const centroids = cities.slice(0, k);
    let changed;
    do {
      clusters.forEach(cluster => cluster.length = 0);
      cities.forEach(city => {
        const nearest = centroids.reduce((nearest, centroid, i) => {
          const dist = calculateCityDistance(city, centroid);
          return dist < nearest.dist ? { i, dist } : nearest;
        }, { i: -1, dist: Infinity });
        clusters[nearest.i].push(city);
      });

      changed = false;
      centroids.forEach((centroid, i) => {
        const newCentroid = average(clusters[i]);
        if (!equal(newCentroid, centroid)) {
          centroids[i] = newCentroid;
          changed = true;
        }
      });
    } while (changed);

    return clusters;
  };

  const nearestNeighbor = (cluster) => {
    const route = [cluster[0]];
    const remaining = cluster.slice(1);

    while (remaining.length) {
      const last = route[route.length - 1];
      const nearestIndex = remaining.reduce((nearestIndex, city, i) => {
        const dist = calculateCityDistance(last, city);
        return dist < calculateCityDistance(last, remaining[nearestIndex]) ? i : nearestIndex;
      }, 0);

      const nearestCity = remaining.splice(nearestIndex, 1)[0];
      route.push(nearestCity);
    }

    return route;
  };

  const twoOpt = (route) => {
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 1; i < route.length - 1; i++) {
        for (let j = i + 1; j < route.length; j++) {
          const newRoute = twoOptSwap(route, i, j);
          if (totalDistance(newRoute) < totalDistance(route)) {
            route = newRoute;
            improved = true;
          }
        }
      }
    }
    return route;
  };

  const twoOptSwap = (route, i, k) => {
    const newRoute = route.slice(0, i)
      .concat(route.slice(i, k + 1).reverse())
      .concat(route.slice(k + 1));
    return newRoute;
  };

  const connectClusters = (optimizedClusters) => {
    let globalRoute = [];

    // Conectar los clústeres de manera ordenada
    optimizedClusters.forEach((cluster, index) => {
      if (index === 0) {
        globalRoute = cluster;
      } else {
        const lastCityOfGlobalRoute = globalRoute[globalRoute.length - 1];
        const nearestCityOfCluster = cluster.reduce((nearest, city) => {
          const dist = calculateCityDistance(lastCityOfGlobalRoute, city);
          return dist < nearest.dist ? { city, dist } : nearest;
        }, { city: null, dist: Infinity });

        globalRoute.push(nearestCityOfCluster.city); 
        globalRoute = globalRoute.concat(cluster.filter(city => city !== nearestCityOfCluster.city));  // Añadimos las demás ciudades del clúster
      }
    });

    globalRoute.push(globalRoute[0]);

    return globalRoute;
  };

  const simulatedAnnealing = (route) => {
    const temp = 10000;
    const coolingRate = 0.003;
    let currentRoute = route.slice();
    let bestRoute = route.slice();

    let currentTemp = temp;
    while (currentTemp > 1) {
      const newRoute = twoOptSwap(currentRoute, randInt(1, currentRoute.length - 1), randInt(1, currentRoute.length - 1));
      const currentDistance = totalDistance(currentRoute);
      const newDistance = totalDistance(newRoute);

      if (acceptanceProbability(currentDistance, newDistance, currentTemp) > Math.random()) {
        currentRoute = newRoute.slice();
      }

      if (totalDistance(currentRoute) < totalDistance(bestRoute)) {
        bestRoute = currentRoute.slice();
      }

      currentTemp *= 1 - coolingRate;
    }

    return bestRoute;
  };

  const acceptanceProbability = (currentDistance, newDistance, temperature) => {
    return newDistance < currentDistance ? 1 : Math.exp((currentDistance - newDistance) / temperature);
  };

  const totalDistance = (route) => {
    return route.reduce((acc, city, i) => {
      if (i === route.length - 1) return acc + calculateCityDistance(city, route[0]);
      return acc + calculateCityDistance(city, route[i + 1]);
    }, 0);
  };

  const average = (cities) => {
    const total = cities.reduce((acc, city) => ({
      x: acc.x + city.x,
      y: acc.y + city.y
    }), { x: 0, y: 0 });
    return { x: total.x / cities.length, y: total.y / cities.length };
  };

  const equal = (cityA, cityB) => {
    return cityA.x === cityB.x && cityA.y === cityB.y;
  };

  const randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const updateGraph = () => {
    const svg = d3.select("svg");
    svg.selectAll("*").remove(); 

    svg.selectAll(".node")
      .data(cities)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill", "red"); 
      
    svg.selectAll(".label")
      .data(cities)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => d.x + 5)
      .attr("y", d => d.y - 5)
      .text(d => d.name);
  };

  const visualizeRouteStepByStep = (route) => {
    const svg = d3.select("svg");

    let i = 0;
    function drawNextStep() {
      if (i < route.length - 1) {
        svg.append("line")
          .attr("x1", route[i].x)
          .attr("y1", route[i].y)
          .attr("x2", route[i + 1].x)
          .attr("y2", route[i + 1].y)
          .attr("stroke", "grey")
          .attr("stroke-width", 2);
        i++;
        setTimeout(drawNextStep, 500);  // Retardo para el siguiente paso
      }
    }

    drawNextStep();
  };

  return (
    <div className="App">
      <h1>Traveling Salesman Problem</h1>
      <form onSubmit={addCity}>
        <label>
          City Name:
          <input type="text" name="cityName" required />
        </label>
        <label>
          X Coordinate:
          <input type="number" name="cityX" required />
        </label>
        <label>
          Y Coordinate:
          <input type="number" name="cityY" required />
        </label>
        <button type="submit">Add City</button>
      </form>

      <button onClick={runTSPHybrid}>Run TSP Algorithm</button>

      <svg width="800" height="600"></svg>
    </div>
  );
}

export default TravellingSalesman;