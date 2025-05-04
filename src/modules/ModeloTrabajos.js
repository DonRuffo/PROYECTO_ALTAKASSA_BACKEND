import mongoose, {Schema, model} from 'mongoose';

const TrabajosSchema = new Schema({
    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario"
    },
    proveedor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario"
    },
    oferta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ofertas",
        required: true
    },
    fecha:{
        type:Date,
        require:true,
        trim:true,
        default: Date.now()
    },
    status:{
        type:String,
        require:true,
        trim:true,
        default:"En espera"
    },
    servicio:{
        type:String,
        trim:true,
        require:true
    },
    tipo:{
        type:String,
        require:true
    },
    desde:{
        type: Date,
        require:true,
        trim:true
    },
    hasta:{
        type: Date,
        require:true,
        trim:true
    },
    precioTotal : {
        type:Number,
        require:true
    },
    calificacionCliente:{
        type:Number,
        require:true,
        default:null
    },
    calificacionProveedor:{
        type:Number,
        require:true,
        default:null
    }
},{
    timestamps:true
})

export default model('Trabajos', TrabajosSchema)