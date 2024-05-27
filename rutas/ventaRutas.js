const express = require('express');
const rutas = express.Router();
const VentaModel = require('../models/Venta');
const SolicitudModel = require('../models/Solicitud');


//endpoint 1  listar todas las Ventas
rutas.get('/getVenta', async (req, res) => {
    try{
        const venta = await VentaModel.find();
        res.json(venta);
    } catch (error){
        res.status(500).json({mensaje: error.mensaje});
    }
});

// endpoint 2 crear Venta
rutas.post('/crearVenta', async (req, res) => {
    const venta = new VentaModel({
        agente: req.body.agente,
        fechaVenta: req.body.fechaVenta,
        monto: req.body.monto,
        tipoMoneda: req.body.tipoMoneda,
        tipoPago: req.body.tipoPago,
        solicitud: req.body.solicitud// asignar el id del usuario

    
    })
    try {
        const nuevaVenta = await venta.save();
        res.status(201).json(nuevaVenta);
    } catch (error){
        res.status(400).json({ mensaje : error.message})
    }
    
});
/// endpoint 3 editar una Venta
rutas.put('/editar/:id', async (req, res) => {
    try{
        const ventaEditada = await VentaModel.findByIdAndUpdate(req.params.id, req.body, {new : true});
        if (!ventaEditada)
            return res.status(404).json({ mensaje : 'REGISTRO DE VENTA NO ENCONTRADO'});
        else
        return res.json(ventaEditada);

    } catch (error) {
        res.status(400).json({ mensaje : error.message});
    }
});


// endpoint 4 eliminar Venta
rutas.delete('/eliminar/:id', async (req, res) => {
    try {
        const ventaEliminada = await VentaModel.findByIdAndDelete(req.params.id);
        if (!ventaEliminada)
            return res.status(404).json({mensaje : 'REGISTRO DE VENTA NO ENCONTRADO'});
        else
            return res.json({mensaje : 'HA ELIMINADO ESTE REGISTRO DE VENTA !!'});
        }
        catch (error){
            res.status(500).json({mensaje : error.message})
        }
});

// Buscar un Regstro de Venta por ID
rutas.get('/busquedaid/:id', async (req, res) =>{
    try{
        const ventaId = await VentaModel.findById(req.params.id);
        if(!ventaId)
            return res.status(404).json({mensaje : 'REGISTRO DE VENTA NO ENCONTRADO!!!'});
        else
        return res.json(ventaId); 
    } catch (error){
        res.status(500).json({ mensaje: error.message})
    }


});

// Busqueda de Venta por Nombre de Agente
rutas.get ('/ventaPorAgente/:agente', async(req, res) =>{
    try{
        const ventaPorAgente = await VentaModel.find({agente : new RegExp( req.params.agente, 'i')});
        return res.json(ventaPorAgente );
        
    }catch (error){
        res.status(500).json({mensaje : error.message})

    }
});

// Eliminar todos los Registros de Ventas
rutas.delete('/eliminarVentas', async (req, res) => {
    try{
        await VentaModel.deleteMany({});
        return res.json({mensaje: 'HA ELIMINADO TODOS LOS REGISTROS DE VENTA'});
    }catch (error) {
        res.status(500).json({mensaje : error.message})
    }

});


//---------------------REPORTES---------------------------------

 //Obtener todas las solicitudes por usuario
 rutas.get('/solicitudPorVenta/:solicitudId', async (peticion, respuesta) =>{
    const {solicitudId} = peticion.params;
    try{
        const solicitud = await SolicitudModel.findById(solicitudId);
        if(!solicitud)
            return respuesta.status(404).json({mensaje : 'Registro de Venta no encontrada'});
        const venta = await VentaModel.find({solicitud : solicitudId}).populate('solicitud');
        respuesta.json(venta);
    }
    catch (error){
        respuesta.status(500).json({mensaje : error.message});
    }
});

rutas.get('/velocidadPorUsuario', async (req, res) => {
    try{
        const venta = await VentaModel.find();
        const reporte = await Promise.all(
            venta.map(async (venta1) => {
                const solicitudes = await SolicitudModel.find({solicitud : venta1._id});
                const totalVelocidades = solicitudes.reduce((sum, solicitud) => sum + solicitud.velocidades,0);
                return{
                    venta: {
                        _id: venta1._id,
                        agente: venta1.agente
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

