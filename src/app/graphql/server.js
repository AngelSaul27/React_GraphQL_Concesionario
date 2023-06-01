const { ApolloServer, gql } = require('apollo-server');
const { Pool } = require('pg');

// Configura la conexión a tu base de datos MariaDB
const pool = new Pool({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432, 
    database: 'hecho_venta'
});

// Define tu esquema de GraphQL
const typeDefs = gql`
    type VentaPorAnio {
        tie_anio: Int
        tie_mes: Int
        cantidad_ventas: Int
        precio_promedio: Float
        total_ingresos: Float
    }

    type ClasificacionVentas {
        ven_total: String
        ven_total_autos: String
        ven_precios_promedios: String
        ven_marca: String
        ven_modelo: String
    }

    type HistoricalVentas {
        his_tiempo: Int
        his_total: String
    }

    type InfoAutosVendidos{
        aut_cantidad: String
        aut_marca: String
        aut_modelo: String
        aut_estado: String
        aut_color: String
    }

    type ventasMensuales {
        ven_mes: String
        ven_total: String
    }
    
    type Query {
        vistaGeneralVentas_Parametros(selectInicialDate: String!, selectFinalDate: String!): [ClasificacionVentas]
        vistaGeneralVentas: [ClasificacionVentas]
        cantidadVentasPorAnio: [VentaPorAnio]
        historicoVentas : [HistoricalVentas]
        vistaGeneralInfoAuto : [InfoAutosVendidos]
        vistaGeneralInfoAuto_Parametros(selectInicialDate: String!, selectFinalDate: String!) : [InfoAutosVendidos]
        ventasMensuales(selectAnioDate: String!) : [ventasMensuales]
    }
`;


// Define los resolvers para resolver las consultas
const resolvers = {
    Query: {
        vistaGeneralVentas_Parametros: async (_, { selectInicialDate, selectFinalDate }) => {
            let connection;
            try{
                connection = await pool.connect();
                const result = await connection.query(`
                    SELECT SUM(com_total) as ven_total,
                    SUM(com_cantidad) as ven_total_autos,
                    AVG(com_precio) as ven_precios_promedios,
                    (
                        SELECT aut_marca as ven_marca 
                        FROM auto 
                        INNER JOIN compra c ON aut_id = c.com_auto
                        WHERE com_fecha >= $1 AND com_fecha <= $2
                        GROUP BY aut_marca, aut_modelo 
                        ORDER BY SUM(c.com_cantidad) 
                        DESC LIMIT 1
                    ) AS ven_marca,
                    (
                        SELECT aut_modelo as ven_modelo 
                        FROM auto 
                        INNER JOIN compra c ON aut_id = c.com_auto
                        WHERE com_fecha >= $1 AND com_fecha <= $2
                        GROUP BY aut_marca, aut_modelo 
                        ORDER BY SUM(c.com_cantidad) 
                        DESC LIMIT 1
                    )  AS ven_modelo 
                    FROM hecho_venta 
                    JOIN tiempo ON hecho_venta.ven_fktiempo = tiempo.tie_id
                    JOIN compra ON hecho_venta.ven_fkcompra = compra.com_id  
                    WHERE com_fecha >= $1 AND com_fecha <= $2
                `, [selectInicialDate, selectFinalDate]);

                return result.rows;
            } catch(error) {
                console.error('Error al obtener las ventas por tiempo:', error);
                throw error;
            } finally {
                if(connection) {
                    connection.release();
                }
            }
        },//USAGE
        vistaGeneralVentas: async () => {
            let connection;
            try {
                connection = await pool.connect();
                const result = await connection.query(`
                    SELECT SUM(com_total) as ven_total,
                    SUM(com_cantidad) as ven_total_autos,
                    AVG(com_precio) as ven_precios_promedios,
                    (
                        SELECT aut_marca as ven_marca 
                        FROM auto 
                        INNER JOIN compra c ON aut_id = c.com_auto
                        GROUP BY aut_marca, aut_modelo 
                        ORDER BY SUM(c.com_cantidad) 
                        DESC LIMIT 1
                    ) AS ven_marca,
                    (
                        SELECT aut_modelo as ven_modelo 
                        FROM auto 
                        INNER JOIN compra c ON aut_id = c.com_auto
                        GROUP BY aut_marca, aut_modelo 
                        ORDER BY SUM(c.com_cantidad) 
                        DESC LIMIT 1
                    )  AS ven_modelo 
                    FROM hecho_venta
                    JOIN tiempo ON hecho_venta.ven_fktiempo = tiempo.tie_id
                    JOIN compra ON hecho_venta.ven_fkcompra = compra.com_id 
                `);
                return result.rows;
            } catch (error) {
                console.error('Error al obtener las ventas por tiempo:', error);
                throw error;
            } finally {
                if (connection) {
                    connection.release();
                }
            }
        },//USAGE

        cantidadVentasPorAnio: async () => {
            let connection;
            try {
                connection = await pool.connect();
                const result = await connection.query(`
                    SELECT tie_anio, tie_mes, COUNT(*) AS cantidad_ventas, 
                    AVG(com_precio) AS precio_promedio
                    FROM tiempo
                    JOIN hecho_venta ON tiempo.tie_id = hecho_venta.ven_fktiempo
                    JOIN compra ON hecho_venta.ven_fkcompra = compra.com_id
                    GROUP BY tie_anio, tie_mes
                `);
                return result.rows;
            } catch (error) {
                console.error('Error al obtener la cantidad de ventas anuales:', error);
                throw error;
            } finally {
                if (connection) {
                    connection.release();
                }
            }
        },//USAGE

        historicoVentas: async () => {
            let connection;
            try{
                connection = await pool.connect();
                const result = await connection.query(`
                    SELECT tie_anio as his_tiempo , SUM(com_cantidad) AS his_total 
                    FROM hecho_venta
                    JOIN tiempo ON hecho_venta.ven_fktiempo = tiempo.tie_id
                    JOIN compra ON hecho_venta.ven_fkcompra = compra.com_id
                    WHERE compra.com_auto IS NOT NULL GROUP BY tie_anio; 
                `);
                return result.rows;
            }catch (error) {
                console.error('Error al obtener el historico de ventas: ', error);
                throw error;
            } finally {
                if(connection) {
                    connection.release();
                }
            }
        },//USAGE

        vistaGeneralInfoAuto: async () => {
            let connection; 
            try{
                connection = await pool.connect();
                const result = await connection.query(`
                    SELECT aut.aut_id, SUM(com_cantidad) as aut_cantidad,
                    (SELECT aut_marca FROM auto 
                        WHERE aut_id =
                                    (SELECT aut.aut_id FROM auto aut 
                            INNER JOIN compra com ON com.com_auto = aut_id 
                            WHERE com.com_cantidad IS NOT NULL 
                            GROUP BY aut_id ORDER BY SUM(com_cantidad) 
                            DESC LIMIT 1)
                    ) as aut_marca,
                        (SELECT aut_modelo FROM auto 
                        WHERE aut_id =
                        (SELECT aut.aut_id FROM auto aut 
                            INNER JOIN compra com ON com.com_auto = aut_id 
                            WHERE com.com_cantidad IS NOT NULL 
                            GROUP BY aut_id ORDER BY SUM(com_cantidad) 
                            DESC LIMIT 1)
                    ) as aut_modelo, 
                    (SELECT aut_estado FROM auto 
                        WHERE aut_id = 
                            (SELECT aut.aut_id FROM auto aut 
                            INNER JOIN compra com ON com.com_auto = aut_id 
                            WHERE com.com_cantidad IS NOT NULL 
                            GROUP BY aut_id ORDER BY SUM(com_cantidad) 
                            DESC LIMIT 1)
                    ) as aut_estado, 
                    (SELECT aut_color FROM auto 
                        WHERE aut_id = 
                            (SELECT aut.aut_id FROM auto aut 
                            INNER JOIN compra com ON com.com_auto = aut_id 
                            WHERE com.com_cantidad IS NOT NULL 
                            GROUP BY aut_id ORDER BY SUM(com_cantidad) 
                            DESC LIMIT 1)
                    ) as aut_color  
                    FROM auto aut 
                    INNER JOIN compra com ON com.com_auto = aut_id 
                    WHERE com.com_cantidad IS NOT NULL 
                    GROUP BY aut_id ORDER BY aut_cantidad DESC LIMIT 1
                `);
                return result.rows;
            }catch (error) {
                console.error('Error al obtener la información de los autos: ', error);
                throw error;
            }finally {
                if(connection) {
                    connection.release();
                }
            }
        },//USAGE
        vistaGeneralInfoAuto_Parametros: async (_, { selectInicialDate, selectFinalDate }) => {
            let connection;
            try {
                connection = await pool.connect();
                const result = await connection.query(`
                    SELECT aut.aut_id, SUM(com_cantidad) as aut_cantidad,
                    (SELECT aut_marca FROM auto 
                        WHERE aut_id =
                                    (SELECT aut.aut_id FROM auto aut 
                            INNER JOIN compra com ON com.com_auto = aut_id 
                            WHERE com.com_cantidad IS NOT NULL AND com_fecha >= $1 AND com_fecha <= $2 
                            GROUP BY aut_id ORDER BY SUM(com_cantidad) 
                            DESC LIMIT 1)
                    ) as aut_marca,
                        (SELECT aut_modelo FROM auto 
                        WHERE aut_id =
                        (SELECT aut.aut_id FROM auto aut 
                            INNER JOIN compra com ON com.com_auto = aut_id 
                            WHERE com.com_cantidad IS NOT NULL AND com_fecha >= $1 AND com_fecha <= $2 
                            GROUP BY aut_id ORDER BY SUM(com_cantidad) 
                            DESC LIMIT 1)
                    ) as aut_modelo, 
                    (SELECT aut_estado FROM auto 
                        WHERE aut_id = 
                            (SELECT aut.aut_id FROM auto aut 
                            INNER JOIN compra com ON com.com_auto = aut_id 
                            WHERE com.com_cantidad IS NOT NULL AND com_fecha >= $1 AND com_fecha <= $2 
                            GROUP BY aut_id ORDER BY SUM(com_cantidad) 
                            DESC LIMIT 1)
                    ) as aut_estado, 
                    (SELECT aut_color FROM auto 
                        WHERE aut_id = 
                            (SELECT aut.aut_id FROM auto aut 
                            INNER JOIN compra com ON com.com_auto = aut_id 
                            WHERE com.com_cantidad IS NOT NULL  AND com_fecha >= $1 AND com_fecha <= $2
                            GROUP BY aut_id ORDER BY SUM(com_cantidad) 
                            DESC LIMIT 1)
                    ) as aut_color  
                    FROM auto aut 
                    INNER JOIN compra com ON com.com_auto = aut_id 
                    WHERE com.com_cantidad IS NOT NULL AND com_fecha >= $1 AND com_fecha <= $2 
                    GROUP BY aut_id ORDER BY aut_cantidad DESC LIMIT 1
                `, [selectInicialDate, selectFinalDate]);
                return result.rows;
            } catch (error) {
                console.error('Error al obtener la información de los autos: ', error);
                throw error;
            } finally {
                if (connection) {
                    connection.release();
                }
            }
        },

        ventasMensuales: async (_, { selectAnioDate }) => {
            let connection;
            try{
                connection = await pool.connect();
                const result = await connection.query(`
                    SELECT SUM(c.com_total) as ven_total, t.tie_mes as ven_mes FROM compra c 
                    INNER JOIN tiempo t ON t.tie_temporal = c.com_id  
                    WHERE t.tie_anio = $1
                    GROUP BY t.tie_mes ORDER BY t.tie_mes
                `, [selectAnioDate]);
                return result.rows;
            } catch (error) {
                console.error('Error al obtener la información de los autos: ', error);
                throw error;
            } finally {
                if (connection) {
                    connection.release();
                }
            }
        },//USAGE
    },
};

// Crea una instancia del servidor Apollo
const server = new ApolloServer({ typeDefs, resolvers });

// Inicia el servidor
server.listen().then(({ url }) => {
    console.log(`🚀🚀 Servidor GraphQL listo en ${url} 🚀🚀`);
});