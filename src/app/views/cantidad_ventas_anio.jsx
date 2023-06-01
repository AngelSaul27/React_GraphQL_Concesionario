import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import {
    Chart as ChartJS,
    ArcElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title
}
from 'chart.js';

ChartJS.register(
    ArcElement,
    LinearScale,
    CategoryScale,
    LineElement,
    PointElement,
    BarElement,
    Tooltip,
    Title,
    Legend,
    Filler
);

export default function Ventas_X_Anio(){

    const [data, setData] = useState(null);
    const [lineData, setlineData] = useState(null);

    useEffect(() => {
        if(data !== null){
            setChartData();
        }
    }, [data]);

    useEffect(() => {
        const getVentas_X_Anio = () => {
            fetch('http://localhost:4000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `{ 
                        cantidadVentasPorAnio {
                            tie_anio
                            tie_mes
                            cantidad_ventas
                            precio_promedio
                        } 
                    }`
                })
            })
            .then(response => response.json())
            .then(data => {
                const Ventas_X_Anio = data.data.cantidadVentasPorAnio;
                const labels = [];
                const amount_sales = [];
                const average_sales = [];

                if(Ventas_X_Anio){
                    
                    Ventas_X_Anio.forEach(ventas => {
                        const label = ventas.tie_mes + '/' + ventas.tie_anio;
                        labels.push(label);
                        amount_sales.push(ventas.cantidad_ventas);
                        average_sales.push(ventas.precio_promedio);
                    });
                    
                    const data = [labels, amount_sales, average_sales]
                    setData(data);
                }

            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });
        };

        getVentas_X_Anio();
    }, []);

    function setChartData() {
        const datasets = {
            labels: data[0],
            datasets: [
                {
                    label: "Cantidad de Ventas",
                    data: data[1],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.4
                },
                {
                    label: "Precio Promedio de las Ventas",
                    data: data[2],
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    tension: 0.4
                },
            ],
        }

        const options = {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Año y Mes"
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    title: {
                        display: true,
                        text: "Cantidad / Promedio de Ventas"
                    }
                }
            },
        }

        //datasets.datasets.forEach(dataset => {
        //    dataset.data = dataset.data.map(value => Math.log10(value));
        //});

        setlineData([datasets, options]);
    }

    return <>
        { data && lineData && 
            <div className='col-span-2 flex flex-col justify-center items-center h-full bg-white rounded-md shadow-xl shadow-neutral-300'>
                <div className='w-full flex gap-3 items-center bg-[#191919] p-2 rounded-t-md'>
                    <div className='bg-red-900 p-[2px] text-white rounded-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 drop-shadow-md cursor-pointer">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className='text-white font-semibold text-sm'>GRAFICA DE AÑOS / MESES CON MAS VENTAS Y SU PROMEDIO</span>
                </div>
                <div className='p-3 py-3 w-full'>
                    <Line options={lineData[1]} data={lineData[0]} />
                </div>
            </div>
        }
    </>
}