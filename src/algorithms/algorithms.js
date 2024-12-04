function knapsack(items, capacity) {
    const start = performance.now();

    let bag = [];
    let lastValue = 0;
    let lastWeight = 0;

    for (let i = 0; i < items.length; i++) {
        for (let k = 0; k < items.length; k++) {
            let currentBag = [];
            let currentValue = 0;
            let currentWeight = 0;

            if (items[i].weight <= capacity) {
                currentBag.push(items[i]);
                currentValue += items[i].value;
                currentWeight += items[i].weight;
            }

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
    const end = performance.now();

    const executionTime = end - start;

    return { items: bag, value: lastValue, weight: lastWeight, executionTime: executionTime };
}




module.exports = {
    knapsack
}
