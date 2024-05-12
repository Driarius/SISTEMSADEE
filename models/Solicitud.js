const mongoose = require('mongoose');
//definir el esquema
const solicitudSchema = new mongoose.Schema({
    // nombre: {type: String, require: true}
    tipo: String,
    caracteristicas: String
});
const SolicitudModel = mongoose.model('Solicitud', solicitudSchema, 'solicitud');
module.exports = SolicitudModel;