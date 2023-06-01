import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

export default function vista_info_general(){
    
    const contentRef = useRef(null);
    const [data, setData] = useState(null);
    
    useEffect(() => {
        const getVentas_Tiempo = () => {
            fetch('http://localhost:4000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `{ 
                        vistaGeneralVentas {
                        ven_total
                        ven_total_autos
                        ven_precios_promedios
                        ven_marca
                        ven_modelo
                        } 
                    }`
                })
            })
            .then(response => response.json())
            .then(data => {
                const Ventas_X_Tiempo = data.data.vistaGeneralVentas[0];
                setData(Ventas_X_Tiempo);
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });
        };

        getVentas_Tiempo();

        contentRef.current?.addEventListener('mousedown', handleMouseDown);
        contentRef.current?.addEventListener('mouseup', handleMouseUp);
        contentRef.current?.addEventListener('mousemove', handleMouseMove);

        return () => {
            contentRef.current?.removeEventListener('mousedown', handleMouseDown);
            contentRef.current?.removeEventListener('mouseup', handleMouseUp);
            contentRef.current?.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    //MOVIMIENTOS DE LAS SECCIONES DE INFORMACIÓN 
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.pageX - contentRef.current.offsetLeft;
        scrollLeft = contentRef.current.scrollLeft;
    };

    const handleMouseUp = () => {
        isDragging = false;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - contentRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Ajusta la sensibilidad del movimiento
        contentRef.current.scrollLeft = scrollLeft - walk;
    };

    //FILTROS
    const [selectInicialDate, setSelectedInicialDate] = useState('2021/01/01');
    const [selectFinalDate, setSelectedFinalDate] = useState('2024/01/01');
    
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
        if (formattedDate > selectInicialDate){
            setSelectedFinalDate(formattedDate);
        }else{
            if(selectInicialDate != null){
                setSelectedFinalDate(null);
            }
        }
    };

    const getVentas_Tiempo_parametros = () => {
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query($selectInicialDate: String!, $selectFinalDate: String!) {
                        vistaGeneralVentas_Parametros(selectInicialDate: $selectInicialDate, selectFinalDate: $selectFinalDate) {
                            ven_total
                            ven_total_autos
                            ven_precios_promedios
                            ven_marca
                            ven_modelo
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
            const Ventas_X_Tiempo = data.data.vistaGeneralVentas_Parametros[0];
            if (Ventas_X_Tiempo){
                setData(Ventas_X_Tiempo);
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    };
    
    return <>
        <div className="w-full flex items-center justify-center gap-5 px-[4.5%]">
            <div className='flex gap-3 items-end bg-[#191919] p-2 rounded-md'>
                <div>
                    <div className='flex gap-2 items-center'>
                            <DatePicker id="fechaInicio"
                                onChange={handleDateInicialChange}
                                dateFormat="yyyy/MM/dd"
                                customInput={
                                    <div className="flex items-center gap-1 cursor-pointer bg-[#] w-max px-2 py-1 rounded-md bg-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                            className="w-5 h-5 text-[#191919]">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                        </svg>
                                        <span className="text-[#191919] font-light">{selectInicialDate ? selectInicialDate : 'Fecha inicial'}</span>
                                    </div>
                                } />
                            <span className="font-light text-[#191919]">-</span>
                            <DatePicker id="fechaTermino"
                                onChange={handleDateFinalChange}
                                dateFormat="yyyy/MM/dd"
                                customInput={
                                    <div className="flex items-center gap-1 cursor-pointer bg-[#] w-max px-2 py-1 rounded-md bg-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                            className="w-5 h-5 text-[#191919]">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                        </svg>
                                        <span className="text-[#191919] font-light">{selectFinalDate ? selectFinalDate : 'Fecha final'}</span>
                                    </div>
                                } />
                    </div>
                </div>
                {selectFinalDate && selectFinalDate &&
                    <div className='relative'>
                        <div className="flex items-center gap-1 cursor-pointer bg-[#a32222] w-max px-2 py-1 rounded-md">
                            <span className="text-white font-light" onClick={getVentas_Tiempo_parametros}>Filtrar</span>
                        </div>
                    </div>
                }
            </div>
        </div>
        <div className='flex items-center gap-3 overflow-x-auto view_info_scroll py-6 pt-1 justify-center' ref={contentRef} >
            { data && 
                <>
                    <div className="flex gap-2 min-w-max text-white bg-[#191919] shadow-md shadow-neutral-400 rounded-md divide-x-4 divide-red-700">
                        <img width="64" height="64" className='py-2 px-2' src="https://img.icons8.com/glyph-neue/64/ffffff/car.png" alt="car" />

                        <div className='p-2 px-3 flex flex-col items-center'>
                            <small className='font-light tracking-wide'>Autos Vendidos</small>
                            <strong>{data.ven_total_autos}</strong>
                        </div>
                    </div>

                    <div className="flex gap-2 min-w-max text-white bg-[#191919] shadow-md shadow-neutral-400 rounded-md divide-x-4 divide-red-700">
                        <img width="64" height="64" className='py-2 px-2' src="https://img.icons8.com/pastel-glyph/64/ffffff/sale--v2.png" alt="sale--v2" />
                        <div className='p-2 px-3 flex flex-col items-center'>
                            <small className='font-light tracking-wide'>Total de Ventas</small>
                        <strong>{typeof parseFloat(data.ven_total) === 'number' ? (parseFloat(data.ven_total)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : ''} <small className='font-light'>MXN</small></strong>
                        </div>
                    </div>

                    <div className="flex gap-2 min-w-max text-white bg-[#191919] shadow-md shadow-neutral-400 rounded-md divide-x-4 divide-red-700">
                        <img width="64" height="64" className='py-2 px-2' src="https://img.icons8.com/ios-filled/50/ffffff/price-tag-euro.png" alt="price-tag-euro" />
                        <div className='p-2 px-3 flex flex-col items-center'>
                            <small className='font-light tracking-wide'>Precio Promedio</small>
                        <strong>{typeof parseFloat(Math.trunc(data.ven_precios_promedios)) === 'number' ? (parseFloat(Math.trunc(data.ven_precios_promedios))).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : ''} <small className='font-light'>MXN</small></strong>
                        </div>
                    </div>

                    <div className="flex gap-2 min-w-max text-white bg-[#191919] shadow-md shadow-neutral-400 rounded-md divide-x-4 divide-red-700">
                        <img width="64" height="64" className='py-2 px-2' src="https://img.icons8.com/ios-filled/50/ffffff/bmw.png" alt="ferrari-land" />
                        <div className='p-2 px-3 flex flex-col items-center'>
                            <small className='font-light tracking-wide'>Modelo Más Vendida</small>
                            <strong>{data.ven_modelo}</strong>
                        </div>
                    </div>

                    <div className="flex gap-2 min-w-max text-white bg-[#191919] shadow-md shadow-neutral-400 rounded-md divide-x-4 divide-red-700">
                        <img width="64" height="64" className='py-2 px-2' src="https://img.icons8.com/ios-filled/50/ffffff/tesla-model-x.png" alt="sale--v2" />
                        <div className='p-2 px-3 flex flex-col items-center'>
                            <small className='font-light tracking-wide'>Marca Más Vendida</small>
                            <strong>{data.ven_marca}</strong>
                        </div>
                    </div>
                </>
            }
        </div>
    </>
}