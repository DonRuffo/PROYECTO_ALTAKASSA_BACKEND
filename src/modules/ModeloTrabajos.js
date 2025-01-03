import mongoose, {Schema, model} from 'mongoose';
mongoose
const TrabajosSchema = new Schema({
    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cliente"
    },
    proveedor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Proveedor"
    },
    servicio:{
        type:String,
        require:true
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
        default:"Agendada"
    },
    precio:{
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