import mongoose ,{ Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'

const Usuario = new Schema({
    nombre: {
        type: String,
        trim: true,
        require: true
    },
    apellido: {
        type: String,
        trim: true,
        require: true
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: true
    },
    telefono: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    direccion: {
        type: String,
        trim: true,
        require: true
    },
    rol:{
        type:String,
        default:'usuario'
    },
    contrasenia: {
        type: String,
        require: true
    },
    confirmarEmail: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: null,
    },
    status: {
        type: Boolean,
        default: true
    },
    ubicacionActual: {
        longitud: {
            type: Number,
            default: null
        },
        latitud: {
            type: Number,
            default: null
        }
    },
    ubicacionTrabajo: {
        longitud: {
            type: Number,
            default: null
        },
        latitud: {
            type: Number,
            default: null
        }
    },
    f_perfil: {
        type: String,
        default: null
    },
    calificacionCliente: {
        type: Number,
        default: 3.5
    },
    calificacionProveedor: {
        type: Number,
        default: 3.5
    },
    ofertas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ofertas'
        }
    ]
},
    {timestamps:true}
)
Usuario.methods.EncriptarContrasenia = async function(password){
    const nivelSal = await bcrypt.genSalt(10)
    const ContraEncriptada = await bcrypt.hash(password, nivelSal)
    return ContraEncriptada
}

Usuario.methods.CompararPasswordCliente = async function(password){
    const comparacion = await bcrypt.compare(password, this.contrasenia)
    return comparacion
}

Usuario.methods.GenerarToken = function(){
    const tokenSesion=this.token = Math.random().toString(36).slice(2)
    return tokenSesion
}

export default model('Usuario', Usuario)