const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro 
rutas.post ('/registro', async (req, res) =>{
try{
    const {nombreusuario, correo, contrasena} = req.body;
    const usuario = new Usuario({nombreusuario, correo, contrasena});
    await usuario.save();
    res.status(201).json({mensaje: 'Usuario Registrado'});

}
catch (error){
    res.status(500).json({mensaje: error.message});
}
});


// inicio de secion 
rutas.post('/iniciarsesion', async (req, res) => {
    try{
        const { correo, contrasena} = req.body;
        const usuario = await Usuario.findOne({ correo});
        if (!usuario)
            return res.status(401).json({ error : 'Correo Invalido'});
        const validarContrasena = await usuario.compararContrasena(contrasena);
        if (!validarContrasena)
            return res.status(401).json({ error : 'Contrasena Invalida'});
        // ceacion de token 
        const token = jwt.sign({usuarioId: usuario._id}, 'clave_secreta', {expiresIn: '8h'});
        res.json({token});
    }
    catch (error){
        res.status(500).json({mensaje: error.message});
    }
});
module.exports = rutas;