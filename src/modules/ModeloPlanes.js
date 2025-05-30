import mongoose, { Schema, model } from "mongoose"

const PlanesSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true
    },
    creditos: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        trim: true
    },

})

export default model('Planes', PlanesSchema)