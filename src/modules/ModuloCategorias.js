import {Schema, model} from "mongoose";

const ModuloCategorias = new Schema({
    nombre:{
        type:String,
        require:true
    },
    suscripciones:{
        type:Number,
        default:0
    }
})

export default model('Categorias', ModuloCategorias)