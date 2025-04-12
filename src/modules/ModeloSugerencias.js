import { Schema, model } from 'mongoose'

const SugerenciasSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    rol: {
        type: String,
        require: true
    },
    nombre: {
        type: String,
        require: true
    },
    experiencia: {
        type: String,
        require: true,
        default: null
    },
    comentario: {
        type: String,
        require: true,
        trim: true,
        default: null
    }
},
    { timestamps: true }
)

export default model('Sugerencias', SugerenciasSchema)