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
    monedasTrabajos: {
        type: Number,
        default: 2
    },
    cantidadOfertas: {
        type: Number,
        default: 7
    },
    calificacionCliente: {
        type: Number,
        default: 5
    },
    calificacionProveedor: {
        type: Number,
        default: 5
    },
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
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(claveSecreta), iv)
    let encriptado = cipher.update(JSON.stringify(ubi), 'utf8', 'hex')
    encriptado += cipher.final('hex')
    return {
        iv: iv.toString('hex'),
        datos: encriptado
    };
}

Usuario.methods.DesencriptarUbi = async function (ubi, ivHex) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(claveSecreta), Buffer.from(ivHex, 'hex'));
    let desencriptado = decipher.update(ubi, 'hex', 'utf8');
    desencriptado += decipher.final('utf8');
    return JSON.parse(desencriptado);
}

export default model('Usuario', Usuario)