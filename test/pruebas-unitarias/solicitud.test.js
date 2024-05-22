// importacion de lirerias
const express = require('express');
const request = require('supertest');
const solicitudRutas = require('../../rutas/solicitudRutas');
const SolicitudModel = require('../../models/Solicitud');
const mongoose = require('mongoose');
const app = express();
//manejo de JSON
app.use(express.json());
app.use('/solicitud', solicitudRutas);

describe('Pruebas Unitarias Modulo Solicitud', () =>{
   
    // se ejecuta antes de realizar las pruebas 
    beforeEach( async () => {
        await mongoose.connect('mongodb://localhost:27017/appsolicitud', {
            useNewUrlParser : true,
        });
        await SolicitudModel.deleteMany({});
    });
    // al finalizar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
    });
    // 1er test
    test('Lista todas las Solicitudes realizadas mediante metodo : GET : getSolicitud', async() =>{

        await SolicitudModel.create({tipo: 'Camioneta', caracteristicas: 'Triton LX-200', 
                                     motor: '4800', transmicion: 'Manual', velocidades: '5',
                                     kilometrage: '21000', modelo: '2021', publicacion: '21-03-2024'});

        await SolicitudModel.create({tipo: 'Vagoneta', caracteristicas: 'Cardina XS', 
                                     motor: '2200', transmicion: 'Automatica', velocidades: '5',
                                     kilometrage: '14500', modelo: '2002', publicacion: '11-01-2024'});
                                     
        // solicitus - request
        const res = await request(app).get('/solicitud/getSolicitud');
  

        // verificar la respuesta
        expect (res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);
    test ('Deberia registrar una nueva Solicitud: POST: /crear', async() =>{
        const nuevaSolicitud = {
            tipo: 'Vagoneta', caracteristicas: 'Cardina XS', 
            motor: '2200', transmicion: 'Automatica', velocidades: '5',
            kilometrage: '14500', modelo: '2002', publicacion: '11-01-2024'

        };
        const res = await request(app).post('/solicitud/crear').send(nuevaSolicitud);
        expect(res.statusCode).toEqual(201);
        expect(res.body.tipo).toEqual(nuevaSolicitud.tipo);

    });
    test ('Deberia Actualizar una solicitud ya existente', async() => {

        const solicitudCreada = await SolicitudModel.create({
            tipo: 'Vagoneta', caracteristicas: 'Cardina XS', 
            motor: '2200', transmicion: 'Automatica', velocidades: '5',
            kilometrage: '14500', modelo: '2002', publicacion: '11-01-2024'
        });
        const solicitudActualizada = {
            tipo: 'Vagoneta ACTUALIZADA', caracteristicas: 'Cardina XS', 
            motor: '2200', transmicion: 'Automatica', velocidades: '5',
            kilometrage: '14500', modelo: '2002', publicacion: '11-01-2024'
        };
        const res = await request(app).put('/solicitud/editar/'+solicitudCreada._id).send(solicitudActualizada);
        expect(res.statusCode).toEqual(200); // ojo 201
        expect(res.body.tipo).toEqual(solicitudActualizada.tipo);
    });
    
    test('Deberia eliminar una solicitud especifica: DELETE: /eliminar/:id', async () =>{
        const solicitudCreada = await SolicitudModel.create({
            tipo: 'Vagoneta ACTUALIZADA', caracteristicas: 'Cardina XS', 
            motor: '2200', transmicion: 'Automatica', velocidades: '5',
            kilometrage: '14500', modelo: '2002', publicacion: '11-01-2024'
        });

        const res = await request(app).delete('/solicitud/eliminar/'+solicitudCreada._id);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({mensaje : 'Registro Eliminado'}); 
    });
});