import { Schema, model } from 'mongoose'

const SugerenciasSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    experiencia: {
        type: String,
        required: true,
        default: null
    },
    comentarios:[{
        fecha: {
            type: Date,
            default: Date.now
        },
        comentario: {
            type: String,
            required: true
        }
    }]
},
    { timestamps: true }
)

export default model('Sugerencias', SugerenciasSchema)