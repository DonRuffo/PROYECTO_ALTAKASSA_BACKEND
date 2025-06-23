import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config()
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
    direccion: {
        type: String,
        trim: true,
        require: true
    },
    rol: {
        type: String,
        default: 'usuario'
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
        type: String,
        default: null
    },
    ubicacionTrabajo: {
        type: String,
        default: null
    },
    ivTra: {
        type: String,
        default: null
    },
    f_perfil: {
        type: String,
        default: null
    },
    publicId:{
        type:String,
        default:null
    },
    monedasTrabajos: {
        type: Number,
        default: 2
    },
    cantidadOfertas: {
        type: Number,
        default: 5
    },
    promedioCliente: {
        type: Number,
        default: 5
    },
    promedioProveedor: {
        type: Number,
        default: 5
    },
    calificacionesProveedor: [Number],
    calificacionesCliente: [Number],
    ofertas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ofertas'
        }
    ]
},
    { timestamps: true }
)
Usuario.methods.EncriptarContrasenia = async function (password) {
    const nivelSal = await bcrypt.genSalt(10)
    const ContraEncriptada = await bcrypt.hash(password, nivelSal)
    return ContraEncriptada
}

Usuario.methods.CompararPasswordUsuario = async function (password) {
    const comparacion = await bcrypt.compare(password, this.contrasenia)
    return comparacion
}

Usuario.methods.GenerarToken = function () {
    const tokenSesion = this.token = Math.random().toString(36).slice(2)
    return tokenSesion
}
Usuario.methods.EncriptarUbicacion = async function (ubi) {
    const claveSecreta = process.env.CLSECRET
    const iv = crypto.randomBytes(16)
    const key = crypto.createHash('sha256').update(claveSecreta).digest();
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encriptado = cipher.update(JSON.stringify(ubi), 'utf8', 'hex')
    encriptado += cipher.final('hex')
    return {
        iv: iv.toString('hex'),
        datos: encriptado
    };
}

Usuario.methods.DesencriptarUbi = async function (ubi, ivHex) {
    const claveSecreta = process.env.CLSECRET
    const key = crypto.createHash('sha256').update(claveSecreta).digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(ivHex, 'hex'));
    let desencriptado = decipher.update(ubi, 'hex', 'utf8');
    desencriptado += decipher.final('utf8');
    return JSON.parse(desencriptado);
}

export default model('Usuario', Usuario)