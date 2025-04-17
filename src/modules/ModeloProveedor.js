import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const Proveedor = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    apellido: {
        type: String,
        require: true,
        trim: true
    },
    direccion: {
        type: String,
        trim: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    telefono: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        default: null
    },
    profesiones: {
        type: String,
        require: true,
        default: null
    },
    rol: {
        type: String,
        default: 'proveedor'
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
    calificacion: {
        type: Number,
        default: null
    },
    oferta: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ofertas'
        }
    ],
    ubicacion: {
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
    }
},
    {
        timestamps: true
    })


Proveedor.methods.EncriptarContrasenia = async (password) => {
    const sal = 10
    const nuevaContra = await bcrypt.hash(password, sal)
    return nuevaContra
}

Proveedor.methods.CompararContra = async function (password) {
    const Comparacion = await bcrypt.compare(password, this.contrasenia)
    return Comparacion
}

Proveedor.methods.GenerarToken = function () {
    const tokenSesion = this.token = Math.random().toString(36).slice(2)
    return tokenSesion
}


export default model('Proveedor', Proveedor)