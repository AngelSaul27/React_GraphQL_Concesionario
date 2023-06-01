'use client'
import React from 'react';

import Header from './views/header.jsx'
import Vista_Info_General from './views/info_general.jsx';
import Vista_Info_General2 from './views/info_general_2.jsx';
import Ventas_X_Anio from './views/cantidad_ventas_anio.jsx';
import Historico_Ventas from './views/historico_ventas.jsx';
import VentasMensualesAnio from './views/ventas_mensuales_anio.jsx';

export default function Home() {
  
  return (
    <>
      <Header />

      <Vista_Info_General />
      <main className='min-h-screen w-full px-[5%] pb-[3%] flex flex-col gap-5'>  

        <div className='charts grid grid-cols-3 gap-5'>
          <Ventas_X_Anio />
          <Historico_Ventas />
        </div>

        <div className='charts grid grid-cols-3 gap-5 mt-4'>
          <Vista_Info_General2 />
          <VentasMensualesAnio />
        </div>

      </main>
    </>
  )
}