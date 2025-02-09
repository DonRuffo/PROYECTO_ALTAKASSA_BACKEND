import mongoose, {Schema, model} from 'mongoose';

const TrabajosSchema = new Schema({
    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cliente"
    },
    proveedor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Proveedor"
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
        type: String,
        default:'08:00'
    },
    hasta:{
        type: String,
        default: '17:00'
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