const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//definir el esquema
const usuarioSchema = new mongoose.Schema({
    // nombre: {type: String, require: true}
   
    nombreusuario: {
        type: String,
        required : true,
        unique : true
    },

     correo: {
        type: String,
        required : true,
        unique : true

     },
    
     contrasena: {
        type: String,
        required : true,
        

     }
});


// hashear contraseña
usuarioSchema.pre('save', async function (next){
    if (this.isModified('contrasena')){
        this.contrasena = await bcrypt.hash(this.contrasena, 10);
    }
    next();
});

// comparar contrasena
usuarioSchema.methods.compararContrasena = async function (contrasenaComparar){
    return await bcrypt.compare(contrasenaComparar, this.contrasena);
};
const UsuarioModel = mongoose.model('Usuario', usuarioSchema, 'usuario');
module.exports = UsuarioModel;