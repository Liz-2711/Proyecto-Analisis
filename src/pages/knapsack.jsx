import { useState } from 'react';
import { knapsack } from '../algorithms/algorithms';
import { ClipLoader } from 'react-spinners';

const Knapsack = () => {
    const [capacity, setCapacity] = useState(0);

    const [size, setSize] = useState(0);

    const [items, setItems] = useState([]);


    const [bagItems, setBagItems] = useState([]);
    const [bagWeight, setBagWeight] = useState(0);
    const [bagValue, setBagValue] = useState(0);
    const [executionTime, setExecutionTime] = useState(0);


    const [loading, setLoading] = useState(false);

    const handleKnapsack = () => {
        setLoading(true);
        setBagItems([]);

        setTimeout(() => {
            const bag = knapsack(items, capacity);
            setBagItems(bag.items);
            setBagWeight(bag.weight);
            setBagValue(bag.value);
    
            const executionTime = bag.executionTime;
            console.log(executionTime);
            setExecutionTime(executionTime);
            setLoading(false);
        }, 0); 
        
    }

    const generateItems = (numItems) => {
        const newItems = [];
        for (let i = 0; i < numItems; i++) {
            const value = Math.floor(Math.random() * 100) + 1; // Valor aleatorio entre 1 y 100
            const weight = Math.floor(Math.random() * 50) + 1; // Peso aleatorio entre 1 y 50
            newItems.push({ value, weight });
        }
        setItems(newItems);

        setBagWeight(0);
        setBagValue(0);
        setBagItems([]);
    };

    return(
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
                <h1 style={{ color: '#2a9d8f', fontSize: '2.5rem', marginBottom: '20px' }}>Knapsack</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '10px', 
                        padding: '20px', 
                        border: '2px solid #264653', 
                        borderRadius: '10px', 
                        backgroundColor: '#f4a261', 
                        width: '250px', 
                        textAlign: 'center' }}>
                        <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#264653' }}>
                            Cantidad de Items
                        </label>
                        <input 
                            value={size} 
                            onChange={(e) => setSize(e.target.value)} 
                            type='number' 
                            style={{ 
                                padding: '10px', 
                                border: '1px solid #264653', 
                                borderRadius: '5px', 
                                fontSize: '1rem' 
                            }} 
                        />
                        <button 
                            onClick={() => generateItems(size)} 
                            style={{ 
                                backgroundColor: '#e76f51', 
                                color: 'white', 
                                padding: '10px', 
                                border: 'none', 
                                borderRadius: '5px', 
                                fontSize: '1rem', 
                                cursor: 'pointer' 
                            }}>
                            Generar Items
                        </button>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '10px', 
                        padding: '20px', 
                        border: '2px solid #264653', 
                        borderRadius: '10px', 
                        backgroundColor: '#f4a261', 
                        width: '250px', 
                        textAlign: 'center' }}>
                        <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#264653' }}>
                            Capacidad
                        </label>
                        <input 
                            value={capacity} 
                            onChange={(e) => {setBagItems([]); setCapacity(e.target.value)}} 
                            type='number' 
                            placeholder='Capacidad de bolso' 
                            style={{ 
                                padding: '10px', 
                                border: '1px solid #264653', 
                                borderRadius: '5px', 
                                fontSize: '1rem' 
                            }} 
                        />
                        <button 
                            onClick={handleKnapsack} 
                            style={{ 
                                backgroundColor: '#e76f51', 
                                color: 'white', 
                                padding: '10px', 
                                border: 'none', 
                                borderRadius: '5px', 
                                fontSize: '1rem', 
                                cursor: 'pointer' 
                            }}>
                            Aceptar
                        </button>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '10px', 
                        padding: '20px', 
                        border: '2px solid #264653', 
                        borderRadius: '10px', 
                        backgroundColor: '#f4a261', 
                        width: '250px', 
                        textAlign: 'center' }}>
                        <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#264653' }}>
                            Tiempo de Ejecucion
                        </label>
                        <label 
                            placeholder='Capacidad de bolso' 
                            style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #264653', 
                                borderRadius: '5px', 
                                fontSize: '1rem',
                                background: 'white',
                                height: '35px',
                                
                            }} 
                        >
                            {executionTime}
                        </label>
                    </div>
                </div>
            </div>


            
            <div style={{display: 'flex', gap: '10px', width: '90%'}}>
                <div style={{display: 'flex', flexDirection: 'column', flex: 'space-between', gap: '4px', width: '50%', alignItems: 'center'}}>
                        <label style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#264653' }}>
                            Elementos
                        </label>                    <div style={{display: 'flex', width: '200px'}}>
                        <p style={{textAlign: 'center', width: '20%', fontWeight: 'bold', fontSize: '18px'}}>Peso</p>
                        <p style={{textAlign: 'center', width: '80%', fontWeight: 'bold', fontSize: '18px'}}>Valor</p>
                    </div>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', width: '200px', height: '40px', background: 'gold', borderRadius: '5px'}}>
                            <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', width: '20%', height: '90%', background: 'orange', borderRadius: '5px', fontWeight: 'bold', fontSize: '18px'}}>{item.weight}</p>
                            <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', width: '80%', height: '90%', fontWeight: 'bold', fontSize: '18px'}}>{item.value}</p>
                        </div>
                    
                    ))}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', flex: 'space-between', gap: '4px', width: '50%', alignItems: 'center'}}>
                    <label style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#264653' }}>
                        Bolso
                    </label>
                    <div style={{display: 'flex', width: '200px'}}>
                        <p style={{textAlign: 'center', width: '20%', fontWeight: 'bold', fontSize: '18px'}}>Peso</p>
                        <p style={{textAlign: 'center', width: '80%', fontWeight: 'bold', fontSize: '18px'}}>Valor</p>
                    </div>
                    {loading ? (
                        <ClipLoader/>
                    ) : (
                        bagItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', width: '200px', height: '40px', background: 'gold', borderRadius: '5px'}}>
     
                                <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', width: '20%', height: '90%', background: 'orange', borderRadius: '5px', fontWeight: 'bold', fontSize: '18px'}}>{item.weight}</p>
                                <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', width: '80%', height: '90%', fontWeight: 'bold', fontSize: '18px'}}>{item.value}</p>
                            </div>
                        ))
                    )}
                    
                    <div style={{display: 'flex', width: '200px'}}>
                        <label style={{textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: '#264653', width: '20%' }}>
                            {bagWeight}

                        </label>
                        
                        <label style={{textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: '#264653', width: '80%' }}>
                            {bagValue}
                        </label>
                    </div> 
                </div>
            </div>
            
        </div>
    )
}

export default Knapsack;