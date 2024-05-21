const mongoose = require('mongoose');
//definir el esquema
const solicitudSchema = new mongoose.Schema({
    // nombre: {type: String, require: true}
     tipo: String,
     caracteristicas: String,
     motor: String,
     transmicion: String,
     velocidades: Number,
     kilometrage: Number,
     modelo: Number,
     publicacion: String
});
const SolicitudModel = mongoose.model('Solicitud', solicitudSchema, 'solicitud');
module.exports = SolicitudModel;