import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import 'chartjs-plugin-annotation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

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
import { type } from 'os';

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

export default function VentasMensualesAnio() {

    const [selectAnioDate, setSelectedAnioDate] = useState('2021');
    const [data, setData] = useState(null);
    const [lineData, setlineData] = useState(null);

    useEffect(() => {
        if (data !== null) {
            setChartData();
        }
    }, [data]);

    useEffect(() => {
        getVentasMensualesAnio();
    }, []);

    const getVentasMensualesAnio = () => {
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                        query($selectAnioDate : String!) {
                            ventasMensuales(selectAnioDate: $selectAnioDate) {
                                ven_mes
                                ven_total
                            }
                        }
                    `,
                variables: {
                    selectAnioDate: selectAnioDate ? selectAnioDate : '2021'
                },
            })
        })
        .then(response => response.json())
        .then(data => {
            const ventas = data.data.ventasMensuales;
            const labels = [];
            const amount = [];
            if (ventas) {
                ventas.forEach(ventas => {
                    labels.push(setFechaName(ventas.ven_mes));
                    amount.push(ventas.ven_total);
                });
                const data = [labels, amount]
                setData(data);
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    };

    function setFechaName(fecha){
        switch (fecha) {
            case "1": 
                return "Ene";
            case "2": 
                return "Feb";
            case "3": 
                return "Mar";
            case "4" :
                return "Abr";
            case "5":
                return "May";
            case "6":
                return "Jun";
            case "7":
                return "Jul";
            case "8":
                return "Ago";
            case "9":
                return "Sep";
            case "10":
                return "Oct";
            case "11":
                return "Nov";
            case "12":
                return "Dic";
        }
    }

    function setChartData() {
        const datasets = {
            labels: data[0],
            datasets: [
                {
                    label: "Cantidad de Ventas",
                    data: data[1],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(99, 75, 255, 0.5)',    
                },
            ],
        }

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: 'rgb(255, 99, 132)'
                    }
                }
            }
        }

        setlineData([datasets, options]);
    }

    const handleDateInicialChange = (date) => {
        const fecha = new Date(date);
        const anio = fecha.getFullYear();
        setSelectedAnioDate(anio.toString());
    };

    return <>
        {data && lineData &&
            <div className='col-span-2 relative flex flex-col items-center h-[420px] bg-white rounded-md shadow-xl shadow-neutral-300'>
                
                <div className='w-full flex items-center gap-3 bg-[#191919] p-2 rounded-t-md'>

                    <div className='bg-red-900 p-[2px] text-white rounded-md h-max'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 drop-shadow-md cursor-pointer">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <span className='text-white font-semibold text-sm min-w-max'>GRAFICA DE VENTAS POR AÑO</span>

                    <div className='w-full flex gap-3 items-center justify-end'>

                        <div className='flex gap-2 items-center'>
                            <DatePicker id="fechaInicio"
                                onChange={handleDateInicialChange}
                                dateFormat="yyyy"
                                showYearPicker  
                                customInput={
                                    <div className="flex items-center gap-1 cursor-pointer w-max px-2 py-1 rounded-md bg-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                            className="w-5 h-5 text-[#191919]">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                        </svg>
                                        <span className="text-[#191919] font-light">{selectAnioDate ? selectAnioDate : 'Fecha inicial'}</span>
                                    </div>
                                } />
                        </div>
                        {selectAnioDate &&
                            <div className="flex items-center cursor-pointer bg-[#a32222] w-max px-2 py-1 rounded-md" onClick={getVentasMensualesAnio}>
                                <span className="text-white font-light">Filtrar</span>
                            </div>
                        }

                    </div>
                </div>

                <div className='h-[380px] w-full flex justify-center items-center py-2'>
                    <Bar options={lineData[1]} data={lineData[0]} />
                </div>

            </div>
        }
    </>
}



