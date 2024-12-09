/*function knapsack(items, capacity) {
    const start = performance.now();

    let bag = [];
    let lastValue = 0;
    let lastWeight = 0;

    let currentBag = [];
    let currentValue = 0;
    let currentWeight = 0;

    for (let i = 0; i < items.length; i++) {
        currentBag = [];
        currentValue = 0;
        currentWeight = 0;

        if (currentWeight + items[i].weight <= capacity) {
            currentBag.push(items[i]);
            currentValue += items[i].value;
            currentWeight += items[i].weight;

            for (let k = 0; k < items.length; k++) {
                if (k !== i && currentWeight + items[k].weight <= capacity) {
                    currentBag.push(items[k]);
                    currentValue += items[k].value;
                    currentWeight += items[k].weight;
        
                    for (let j = 0; j < items.length; j++) {
                        if (j !== i && j !== k && currentWeight + items[j].weight <= capacity) {
                            currentBag.push(items[j]);
                            currentValue += items[j].value;
                            currentWeight += items[j].weight;
                        }
                    }
                    if (currentValue >= lastValue) {
                        lastValue = currentValue;
                        lastWeight = currentWeight;
                        bag = [...currentBag];
                    }
                    
                }
                         
            }
        }
           
    }
    const end = performance.now();

    const executionTime = end - start;

    return { items: bag, value: lastValue, weight: lastWeight, executionTime: executionTime };
}*/

async function knapsack(items, capacity) {
    const start = performance.now();

    let lastValue = 0;
    let lastWeight = 0;
    let bag = [];

    function search(index, currentWeight, currentValue, currentBag) {
        if (index >= items.length) {
            if (currentWeight <= capacity && currentValue > lastValue) {
                lastValue = currentValue;
                lastWeight = currentWeight;
                bag = [...currentBag];
            }
            return;
        }


        search(index + 1, currentWeight, currentValue, currentBag);

        if (currentWeight + items[index].weight <= capacity) {

            currentBag.push(items[index]);

            search(index + 1, currentWeight + items[index].weight, currentValue + items[index].value, currentBag);
            currentBag.pop(); 
        }
    }

    search(0, 0, 0, []);

    const end = performance.now();
    const executionTime = end - start;

    return {
        items: bag,
        value: lastValue,
        weight: lastWeight,
        executionTime: executionTime,
    };
}

//Este es el algoritmo usando progrmacio dinamica generado con ChatGPT
async function knapsackdp (items, capacity) {
    const start = performance.now();
    const n = items.length;
    const K = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
    // Construir la tabla K[][] de abajo hacia arriba
    for (let i = 0; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (i === 0 || w === 0) {
          K[i][w] = 0; // Caso base: sin elementos o sin capacidad
        } else if (items[i - 1].weight <= w) {
          // Incluir o no incluir el ítem actual
          K[i][w] = Math.max(
            items[i - 1].value + K[i - 1][w - items[i - 1].weight],
            K[i - 1][w]
          );
        } else {
          // No incluir el ítem porque excede la capacidad
          K[i][w] = K[i - 1][w];
        }
      }
    }
  
    // Reconstrucción de la solución óptima (opcional)
    const selectedItems = [];
    let w = capacity;
    for (let i = n; i > 0 && w > 0; i--) {
      if (K[i][w] !== K[i - 1][w]) {
        selectedItems.push(items[i - 1]);
        w -= items[i - 1].weight;
      }
    }
  
    const end = performance.now();
    const executionTime = end - start;
    return {
      maxValue: K[n][capacity],
      selectedItems,
      executionTime
    };
}
  


module.exports = {
    knapsack,
    knapsackdp
}
