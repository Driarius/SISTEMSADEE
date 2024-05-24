// REALIZAR UN NUEVO CRUD CREANDO
//MODELO - RUTAS - ESQUEMA----- REALACIONADO PEDIDO CON SOLICITUD

const mongoose = require('mongoose');
//definir el esquema
const ventaSchema = new mongoose.Schema({
    // nombre: {type: String, require: true}
     agente: String,
     fechaVenta: String,
     monto: Number,
     tipoMoneda: String,
     tipoPago: String,
     solicitud: { type: mongoose.Schema.Types.ObjectId, ref : 'Solicitud'}


});
const VentaModel = mongoose.model('Venta', ventaSchema, 'venta');
module.exports = VentaModel;