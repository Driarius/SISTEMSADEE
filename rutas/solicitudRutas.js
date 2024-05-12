const express = require('express');
const rutas = express.Router();
const SolicitudModel = require('../models/Solicitud');

//endpoint traer todas las slicitudes
rutas.get('/getSolicitud', async (req, res) => {
    try{
        const solicitud = await SolicitudModel.find();
        res.json(solicitud);
    } catch (error){
        res.status(500).json({mensaje: error.mensaje});
    }
});

module.exports = rutas;