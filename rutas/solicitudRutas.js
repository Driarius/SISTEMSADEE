const express = require('express');
const rutas = express.Router();
const SolicitudModel = require('../models/Solicitud');
const UsuarioModel = require('../models/Usuario');

//endpoint traer todas las slicitudes
rutas.get('/getSolicitud', async (req, res) => {
    try{
        const solicitud = await SolicitudModel.find();
        res.json(solicitud);
    } catch (error){
        res.status(500).json({mensaje: error.mensaje});
    }
});

// endpoint 2 crear
rutas.post('/crear', async (req, res) => {
    const solicitud = new SolicitudModel({
        tipo: req.body.tipo,
        caracteristicas: req.body.caracteristicas,
        motor: req.body.motor,
        transmicion: req.body.transmicion,
        velocidades: req.body.velocidades,
        kilometrage: req.body.kilometrage,
        modelo: req.body.modelo,
        publicacion: req.body.publicacion,
        usuario: req.body.usuario// asignar el id del usuario

    
    })
    try {
        const nuevaSolicitud = await solicitud.save();
        res.status(201).json(nuevaSolicitud);
    } catch (error){
        res.status(400).json({ mensaje : error.message})
    }
    
});

// endpoint 3 editar
rutas.put('/editar/:id', async (req, res) => {
    try{
        const solicitudEditada = await SolicitudModel.findByIdAndUpdate(req.params.id, req.body, {new : true});
        if (!solicitudEditada)
            return res.status(404).json({ mensaje : 'Solicitud no Encontrada !!!'});
        else
        return res.json(solicitudEditada);

    } catch (error) {
        res.status(400).json({ mensaje : error.message});
    }
})

// endpoint 4 eliminar
rutas.delete('/eliminar/:id', async (req, res) => {
    try {
        const solicitudEliminada = await SolicitudModel.findByIdAndDelete(req.params.id);
        if (!solicitudEliminada)
            return res.status(404).json({mensaje : 'Solicitud no encontrada !!'});
        else
            return res.json({mensaje : 'Registro Eliminado'});
        }
        catch (error){
            res.status(500).json({mensaje : error.message})
        }
});



// obtener una receta por su ID
rutas.get('/busquedaid/:id', async (req, res) =>{
    try{
        const busquedaid = await SolicitudModel.findById(req.params.id);
        if(!busquedaid)
            return res.status(404).json({mensaje : 'Solicitud no encontrada!!!'});
        else
        return res.json(busquedaid); 
    } catch (error){
        res.status(500).json({ mensaje: error.message})
    }


});
// obtener recetas por un ingrediente especifico
rutas.get ('/solicitudPorcaracteristica/:caracteristica', async(req, res) =>{
    try{
        const solicitudCaracteristica = await SolicitudModel.find({caracteristicas : new RegExp( req.params.caracteristica, 'i')});
        return res.json(solicitudCaracteristica);
    }catch (error){
        res.status(500).json({mensaje : error.message})
    }
});
// eliminar todas las receta
rutas.delete('/eliminartodas', async (req, res) => {
    try{
        await SolicitudModel.deleteMany({});
        return res.json({mensaje: "Todas las Solicitudeas Han sido eliminadas"});
    }catch (error) {
        res.status(500).json({mensaje : error.message})
    }

});

// contar el numero total de recetas
rutas.get('/totalSolicitudes', async (req, res) => {
    try{
        const total = await SolicitudModel.countDocuments();
        return res.json({totalSolicitudes : total});
    }catch (error){
            res.status(500).json({mensaje : error.message});
    }
});
// obtener recetas ordenadas por nombre ascendente
rutas.get('/ordenarSolicitudes', async (req, res)=>{
    try{
        const solicitudesOrdenadas = await SolicitudModel.find().sort({tipo: 1 });
        res.status(200).json(solicitudesOrdenadas);
    }catch (error){
        res.status(500).json({mensaje : error.message});
    }

});

// filtrar por dos condiciones
 rutas.get('/dosCondiciones', async (req, res) =>{
    try{
        const condiciones = await SolicitudModel.find(
            {$and : [ {velocidades: { $eq: 5}}, 
                      {modelo: {$lt : 2024}}, {modelo: {$gt : 1997}}, 
                      {kilometrage: {$lt : 23501}},{kilometrage: {$gt : 17000}} 
                    
            ]});
        res.status(200).json(condiciones);
    } catch (error){
                     res.status(500).json ({mensaje: error.message});
                   }

 });
// buscar vehiculo por tipo
rutas.get('/tipoVehiculo/:tipo', async (req, res) =>{
    try{
        const vehiculoTipo = await SolicitudModel.find({tipo : req.params.tipo}

        );
        res.status(200).json(vehiculoTipo)
    }catch (error){
        res.status(500).json({ mensaje : error.message})
    }
});

// Busqueda por modelo de vehiculo
rutas.get('/modeloCondiciones/:tipo', async (req, res) =>{
    try{
        const condiciones = await SolicitudModel.find(
            {$and : [ {modelo: { $eq: 2023}}, 
                      {tipo: req.params.tipo},
                      {velocidades: { $eq: 4}}     
            ]});
        res.status(200).json(condiciones);
    } catch (error){
                     res.status(500).json ({mensaje: error.message});
                   }

 });

 //Obtener todas las solicitudes por usuario
rutas.get('/solicitudPorUsuario/:usuarioId', async (peticion, respuesta) =>{
    const {usuarioId} = peticion.params;
    try{
        const usuario = await UsuarioModel.findById(usuarioId);
        if(!usuario)
            return respuesta.status(404).json({mensaje : 'Solicitud no encontrada'});
        const solicitud = await SolicitudModel.find({usuario : usuarioId}).populate('usuario');
        respuesta.json(solicitud);
    }
    catch (error){
        respuesta.status(500).json({mensaje : error.message});
    }
});

// SUMAR la cantidad de velocidades por usuario
rutas.get('/velocidadPorUsuario', async (req, res) => {
    try{
        const usuarios = await UsuarioModel.find();
        const reporte = await Promise.all(
            usuarios.map(async (usuario1) => {
                const solicitudes = await SolicitudModel.find({usuario : usuario1._id});
                const totalVelocidades = solicitudes.reduce((sum, solicitud) => sum + solicitud.velocidades,0);
                return{
                    usuario: {
                        _id: usuario1._id,
                        nombreusuario: usuario1.nombreusuario
                    },
                    totalVelocidades,
                    solicitud: solicitudes.map( s => ({
                        _id: s._id,
                        tipo: s.tipo,
                        velocidades: s.velocidades
                    }))
                }
            })
        )
        res.json(reporte);
    } catch(error){
        res.status(500).json({mensaje : error.message})

    }
});


module.exports = rutas;