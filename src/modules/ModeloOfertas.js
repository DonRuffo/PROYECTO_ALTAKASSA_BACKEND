import mongoose, {Schema, model} from 'mongoose';

const OfertasSchema = new Schema({
    proveedor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Proveedor"
    },
    precioPorDia:{
        type:Number,
        require:true
    },
    precioPorHora:{
        type:Number,
        require:true
    },
    servicio:{
        type:String,
        trim:true,
        require:true
    },
    descripcion:{
        type:String,
        require:true
    }
})

export default model('Ofertas', OfertasSchema)