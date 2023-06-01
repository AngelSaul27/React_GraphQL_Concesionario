import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

export default function Vista_Info_General2(){
    const [selectInicialDate, setSelectedInicialDate] = useState('2021/01/01');
    const [selectFinalDate, setSelectedFinalDate] = useState('2024/01/01');

    const [data, setData] = useState(null);

    useEffect(() => {
        const getInformacionAutos = () => {
            fetch('http://localhost:4000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `{ 
                        vistaGeneralInfoAuto {
                            aut_cantidad
                            aut_marca
                            aut_modelo
                            aut_estado
                            aut_color
                        }
                    }`
                })
            })
            .then(response => response.json())
            .then(data => {
                const informacion = data.data.vistaGeneralInfoAuto[0];
                setData(informacion);
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });
        };

        getInformacionAutos();
    }, []);

    const handleDateInicialChange = (date) => {
        const formattedDate = format(date, 'yyyy/MM/dd');

        if (formattedDate < selectFinalDate) {
            setSelectedInicialDate(formattedDate);
        } else {
            if (selectFinalDate != null) {
                setSelectedInicialDate(null);
            }
        }
    };

    const handleDateFinalChange = (date) => {
        const formattedDate = format(date, 'yyyy/MM/dd');
        if (formattedDate > selectInicialDate) {
            setSelectedFinalDate(formattedDate);
        } else {
            if (selectInicialDate != null) {
                setSelectedFinalDate(null);
            }
        }
    };
    
    const getInformacionAutoParam = () => {
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query($selectInicialDate: String!, $selectFinalDate: String!) {
                        vistaGeneralInfoAuto_Parametros(selectInicialDate: $selectInicialDate, selectFinalDate: $selectFinalDate) {
                            aut_cantidad
                            aut_marca
                            aut_modelo
                            aut_estado
                            aut_color
                        }
                    }
                `,
                variables: {
                    selectInicialDate: selectInicialDate,
                    selectFinalDate: selectFinalDate
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            const informacion = data.data.vistaGeneralInfoAuto_Parametros[0];
            setData(informacion);
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    };

    return <>
        <div className='flex flex-col gap-2 bg-white rounded-md shadow-xl shadow-neutral-300' >

            <div className='flex gap-2 items-center justify-end min-w-full bg-[#191919] p-2 rounded-t-md'>
                
                <div>
                    <DatePicker id="fechaInicio"
                        onChange={handleDateInicialChange}
                        dateFormat="yyyy/MM/dd"
                        customInput={
                            <div className="flex items-center gap-1 cursor-pointer w-max px-2 py-1 rounded-md bg-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                    className="w-5 h-5 text-[#191919]">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                </svg>
                                <span className="text-[#191919] font-light">{selectInicialDate ? selectInicialDate : 'Fecha inicial'}</span>
                            </div>
                        } />
                </div>
                
                <span className="font-light text-[white]">-</span>

                <div>
                    <DatePicker id="fechaTermino"
                        onChange={handleDateFinalChange}
                        dateFormat="yyyy/MM/dd"
                        customInput={
                            <div className="flex items-center gap-1 cursor-pointer w-max px-2 py-1 rounded-md bg-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                    className="w-5 h-5 text-[#191919]">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                </svg>
                                <span className="text-[#191919] font-light">{selectFinalDate ? selectFinalDate : 'Fecha final'}</span>
                            </div>
                        } />
                </div>

                { selectFinalDate && selectFinalDate &&
                    <div className='relative' onClick={getInformacionAutoParam}>
                        <div className="flex items-center gap-1 cursor-pointer bg-[#a32222] w-max px-2 py-1 rounded-md">
                            <span className="text-white font-light">Filtrar</span>
                        </div>
                    </div>
                }

            </div>
            { data && 
                <div className='flex flex-col gap-6 py-3 px-5'>
                    <div className="flex gap-2 min-w-full text-white bg-[#191919] shadow-lg shadow-neutral-800 rounded-md divide-x-4 divide-red-700">
                        <img width="64" height="64" className='py-2 px-2' src="https://img.icons8.com/ios-filled/50/ffffff/color-palette.png" alt="color-palette" alt="car" />
                        <div className='p-2 px-3 flex flex-col'>
                            <small className='font-light tracking-wide'>Color de Autos Más Vendido :</small>
                            <strong>{data.aut_color}</strong>
                        </div>
                    </div>
                    <div className="flex gap-2 min-w-full text-white bg-[#191919] shadow-lg shadow-neutral-800 rounded-md divide-x-4 divide-red-700">
                        <img width="64" height="64" className='py-2 px-2' src="https://img.icons8.com/ios-filled/50/ffffff/bmw.png" alt="ferrari-land" />
                        <div className='p-2 px-3 flex flex-col'>
                            <small className='font-light tracking-wide'>Modelo de Auto Más Vendido :</small>
                            <strong>{data.aut_modelo}</strong>
                        </div>
                    </div>
                    <div className="flex gap-2 min-w-full text-white bg-[#191919] shadow-lg shadow-neutral-800 rounded-md divide-x-4 divide-red-700">
                        <img width="64" height="64" className='py-2 px-2' src="https://img.icons8.com/ios-filled/50/ffffff/tesla-model-x.png" alt="sale--v2" />
                        <div className='p-2 px-3 flex flex-col'>
                            <small className='font-light tracking-wide'>Marca de Auto Más Vendido :</small>
                            <strong>{data.aut_marca}</strong>
                        </div>
                    </div>
                    <div className="flex gap-2 min-w-full text-white bg-[#191919] shadow-lg shadow-neutral-800 rounded-md divide-x-4 divide-red-700">
                        <img width="64" height="64" className='py-2 px-2' src="https://img.icons8.com/ios/64/ffffff/new--v1.png" alt="ferrari-land" />
                        <div className='p-2 px-3 flex flex-col'>
                            <small className='font-light tracking-wide'>Tipo de Auto Más Vendido :</small>
                            <strong>{data.aut_estado === 'N' ? 'Autos Nuevos' : 'Autos Usados'}</strong>
                        </div>
                    </div>
                </div>
            }
        </div>
    </>
}