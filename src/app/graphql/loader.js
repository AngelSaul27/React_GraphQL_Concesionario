/* CONSULTAS DE CARGA DE PAGINA 

const getVentas_Tiempo = (e) => {
    fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: 
            `{ 
                estadoVentasPorTiempo 
                {
                    ven_total
                    ven_total_autos
                    ven_precios_promedios
                    ven_marca
                    ven_modelo
                } 
            }` 
        })
    })
    .then(response => response.json()).then(data => {
        const Ventas_X_Tiempo = data.data.estadoVentasPorTiempo;
        const extractData = [];
        console.log(data.data.estadoVentasPorTiempo);
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
    });
}

import { getVentas_Tiempo } from './graphql/loader.js';


export {
    getVentas_Tiempo,
}*/