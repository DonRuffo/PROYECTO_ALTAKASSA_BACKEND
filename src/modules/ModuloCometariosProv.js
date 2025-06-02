import mongoose, { Schema, model } from "mongoose";

const ModuloComentariosProv = new Schema({
    emisor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    receptor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    fecha:{
        type: Date,
        require:true,
        trim:true
    },
    cometario:{
        type:String,
        require:true
    }
})

export default model('Comentarios', ModuloComentariosProv)
