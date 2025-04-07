import mongoose, { Schema, model} from "mongoose"

const PagosSchema = new Schema({
    ofertas:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ofertas"
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    numeroTarjeta:{
        type:String,
        require:true,
        trim:true
    },
    nombreTarjeta:{
        type:String,
        require:true,
        trim:true
    },
    pais:{
        type:String,
        require:true
    }

})

export default model('Pagos',PagosSchema)