import React, { useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
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

export default function Historico_Ventas() {

    const [data, setData] = useState(null);
    const [doughnut, setDoughnutData] = useState(null);

    useEffect(() => {
        if (data !== null) {
            setChartData();
        }
    }, [data]);

    useEffect(() => {
        const getHistoricoVentas = () => {
            fetch('http://localhost:4000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `{ 
                        historicoVentas {
                            his_tiempo
                            his_total
                        } 
                    }`
                })
            })
            .then(response => response.json())
            .then(data => {
                const Historico = data.data.historicoVentas;
                const labels = [];
                const amount = [];

                Historico.forEach(element => {
                    labels.push(element.his_tiempo);
                    amount.push(element.his_total);
                });

                if (Historico) {
                    const data = [labels, amount]
                    setData(data);
                }
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });
        };

        getHistoricoVentas();
    }, []);

    function setChartData() {
        const datasets = {
            labels: data[0],
            datasets: [
                {
                    label: "Cantida de Ventas",
                    data: data[1],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        }

        const options = {
            plugins: {
                title: {
                    display: true,
                    text: 'Historico de Ventas de autos Anuales',
                },
            },
        }
        setDoughnutData([datasets, options]);
    }

    return <>
        {doughnut && data &&
            <div className='flex flex-col items-center bg-white rounded-md shadow-xl shadow-neutral-300'>
                <div className='w-full flex gap-3 items-center bg-[#191919] p-2 rounded-t-md'>
                    <div className='bg-red-900 p-[2px] text-white rounded-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 drop-shadow-md cursor-pointer">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className='text-white font-semibold text-sm'>GRAFICA DE VENTAS ANUALES</span>
                </div>
                <div className='p-2 w-full'>
                    <Doughnut data={doughnut[0]} options={doughnut[1]}/>
                </div>
            </div>
        }
    </>
}
//[#191919]