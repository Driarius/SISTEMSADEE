// importacion de libs
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const solicitudRutas = require('./rutas/solicitudRutas');

// configuraciones de enviroment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

//manejo de JSON
app.use(express.json());

// conexion con MONGODB
mongoose.connect(MONGO_URI).then(
    () => {
        console.log('Conexion Exitosa');
        app.listen(PORT, () => {console.log('Servidor express corriendo en el puerto ' + PORT)})
    }
).catch( error => console.log('error en la conexion ', error));

// utilizar las rutas de solicitud

app.use('/solicitud', solicitudRutas);