import { useState } from 'react';
import { knapsack, knapsackdp } from '../algorithms/algorithms';
import { Table, InputNumber, Button, Card, List, Spin } from 'antd';

const Knapsack = () => {
    const [capacity, setCapacity] = useState(0);
    const [size, setSize] = useState(0);
    const [items, setItems] = useState([]);
    const [bagItems, setBagItems] = useState([]);
    const [bagWeight, setBagWeight] = useState(0);
    const [bagValue, setBagValue] = useState(0);
    const [bag2Items, setBag2Items] = useState([]);
    const [bag2Weight, setBag2Weight] = useState(0);
    const [bag2Value, setBag2Value] = useState(0);
    const [executionTime, setExecutionTime] = useState(0);
    const [execution2Time, setExecution2Time] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [results, setResults] = useState([]);

    const handleKnapsack1 = async () => {
        setLoading(true);
        try {
            const bag = await knapsack(items, capacity);
            setBagItems(bag.items);
            setBagWeight(bag.weight);
            setBagValue(bag.value);
            setExecutionTime(bag.executionTime);
        } catch (error) {
            console.error("Error en knapsack1", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKnapsack2 = async () => {
        setLoading2(true);
        try {
            const bag2 = await knapsackdp(items, capacity);
            setBag2Items(bag2.selectedItems);
            setBag2Weight(bag2.weight);
            setBag2Value(bag2.maxValue);
            setExecution2Time(bag2.executionTime);
        } catch (error) {
            console.error("Error en knapsackdp", error);
        } finally {
            setLoading2(false);
        }
    };

    const handleKnapsack = async () => {
        await Promise.all([handleKnapsack1(), handleKnapsack2()]);
        addResult(items.length, capacity, executionTime, execution2Time);
    };

    const addResult = (itemQuantity, capacity, executionTime1, executionTime2) => {
        setResults((prevResults) => [
            ...prevResults,
            {
                itemQuantity,
                capacity,
                executionTime1: parseFloat(executionTime1.toFixed(2)),
                executionTime2: parseFloat(executionTime2.toFixed(2)),
            },
        ]);
    };
    

    const generateItems = (numItems) => {
        const newItems = Array.from({ length: numItems }, () => ({
            value: Math.floor(Math.random() * 100) + 1,
            weight: Math.floor(Math.random() * 50) + 1,
        }));
        setItems(newItems);
        setBagItems([]);
        setBagWeight(0);
        setBagValue(0);
        setBag2Items([]);
        setBag2Weight(0);
        setBag2Value(0);
    };

    const itemColumns = [
        { title: 'Peso', dataIndex: 'weight', key: 'weight' },
        { title: 'Valor', dataIndex: 'value', key: 'value' },
    ];

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ color: '#2a9d8f', fontSize: '2.5rem', marginBottom: '20px' }}>Knapsack</h1>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <Card title="Generar Items">
                    <InputNumber
                        min={1}
                        value={size}
                        onChange={(value) => setSize(value)}
                        placeholder="Cantidad de Items"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <Button type="primary" onClick={() => generateItems(size)} block>
                        Generar
                    </Button>
                </Card>
                <Card title="Capacidad">
                    <InputNumber
                        min={1}
                        value={capacity}
                        onChange={(value) => setCapacity(value)}
                        placeholder="Capacidad del bolso"
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <Button type="primary" onClick={handleKnapsack} block>
                        Ejecutar Algoritmos
                    </Button>
                </Card>
            </div>
            <div style={{ display: 'flex', gap: '20px', width: '100%', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
                    <Card title="Items Generados" style={{ flex: 1 }}>
                        <Table
                            dataSource={items}
                            columns={itemColumns}
                            pagination={false}
                            rowKey={(item, index) => index}
                        />
                    </Card>
                    <Card title="Resultados Knapsack" style={{ flex: 1 }}>
                        {loading ? (
                            <Spin />
                        ) : (
                            <List
                                bordered
                                dataSource={bagItems}
                                renderItem={(item) => (
                                    <List.Item>
                                        Peso: {item.weight}, Valor: {item.value}
                                    </List.Item>
                                )}
                            />
                        )}
                        <p>Peso Total: {bagWeight}</p>
                        <p>Valor Total: {bagValue}</p>
                    </Card>
                    <Card title="Resultados Knapsack DP" style={{ flex: 1 }}>
                        {loading2 ? (
                            <Spin />
                        ) : (
                            <List
                                bordered
                                dataSource={bag2Items}
                                renderItem={(item) => (
                                    <List.Item>
                                        Peso: {item.weight}, Valor: {item.value}
                                    </List.Item>
                                )}
                            />
                        )}
                        <p>Peso Total: {bag2Weight}</p>
                        <p>Valor Total: {bag2Value}</p>
                    </Card>
                </div>
                <Card title="Historial de Resultados" style={{ width: '40%' }}>
                    <Button type="primary" onClick={() => {setResults([])}} block>
                        Resetear
                    </Button>
                    <Table
                        dataSource={results}
                        columns={[
                            { title: 'Cantidad de Items', dataIndex: 'itemQuantity', key: 'itemQuantity' },
                            { title: 'Capacidad', dataIndex: 'capacity', key: 'capacity' },
                            { title: 'Tiempo Algoritmo 1 (ms)', dataIndex: 'executionTime1', key: 'executionTime1' },
                            { title: 'Tiempo Algoritmo DP (ms)', dataIndex: 'executionTime2', key: 'executionTime2' },
                        ]}
                        pagination={false}
                        rowKey={(result, index) => index}
                    />
                </Card>
            </div>
        </div>

    );
};

export default Knapsack;
