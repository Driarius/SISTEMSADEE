// importacion de libs
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas');
const Usuario = require('./models/Usuario');
require('dotenv').config();
const app = express();
const solicitudRutas = require('./rutas/solicitudRutas');
const ventaRutas = require('./rutas/ventaRutas');

// configuraciones de enviroment
const PORT = process.env.PORT || 8000;
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

const autenticar = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        //comparacion con tokensinvalidos
        //si es igual a los que estan en tu lista
        //listatokenInvalidos.foreahce( ====token)
        //res.status)()404, send(Token Invalido)
        // return  'token invalido'


      /*  app.post("/logout", authenticateToken, async (request, response) => {
            const { userId, token, tokenExp } = request;
        
            const token_key = `bl_${token}`;
            await redisClient.set(token_key, token);
            redisClient.expireAt(token_key, tokenExp);
        
            return response.status(200).send("Token invalidated");
        });*/
        if (!token)
            res.status(401).json({mensaje: 'No existe el token de auenticacion'});
        const decodificar = jwt.verify(token, 'clave_secreta');
        req.usuario = await Usuario.findById(decodificar.usuarioId);
        next();

    }
    catch(error){
        res.status(400).json({ error: 'Token Invalido'});
    }
}
// utilizar las rutas de solicitud
app.use('/auth', authRutas);
app.use('/solicitud', autenticar, solicitudRutas);
app.use('/venta', autenticar, ventaRutas);//app.use('/solicitud', solicitudRutas);