// importacion de lirerias
const express = require('express');
const request = require('supertest');
const ventaRutas = require('../../rutas/ventaRutas');
const VentaModel = require('../../models/Venta');
const mongoose = require('mongoose');
const app = express();
//manejo de JSON
app.use(express.json());
app.use('/venta', ventaRutas);

describe('Pruebas Unitarias Modulo Ventas', () =>{
   
    // se ejecuta antes de realizar las pruebas 
    beforeEach( async () => {
        await mongoose.connect('mongodb://localhost:27017/appsolicitud', {
            useNewUrlParser : true,
        });
        await VentaModel.deleteMany({});
    });
    // al finalizar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
    });
    // 1er test
    test('Recuperacion de lista de Ventas mediante metodo : GET : getVenta', async() =>{

        await VentaModel.create({agente: 'GILMAR CHINCHE CALA', fechaVenta: '12-12-2021', 
                                     monto: '23000', tipoMoneda: 'Dolares', tipoPago: 'AL CONTADO'});

         await VentaModel.create({agente: 'GILMAR CHINCHE CALA', fechaVenta: '12-12-2021', 
                                     monto: '23000', tipoMoneda: 'Dolares', tipoPago: 'AL CONTADO'});

       
                                     
        // solicitus - request
        const res = await request(app).get('/venta/getVenta');
  

        // verificar la respuesta
        expect (res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);

    test ('Deberia registrar una nueva Venta mediante: POST: /crear', async() =>{
        const nuevaVenta = {
            agente: 'gilmar', fechaVenta: '12-12-2021', 
           monto: '23000', tipoMoneda: 'Dolares', tipoPago: 'AL CONTADO'

        };
        const res = await request(app).post('/venta/crearVenta').send(nuevaVenta);
        expect(res.statusCode).toEqual(201);
        expect(res.body.agente).toEqual(nuevaVenta.agente);

    });

});

