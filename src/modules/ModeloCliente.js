import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const ClienteSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    apellido:{
        type:String,
        require:true,
        trim:true
    },
    direccion:{
        type:String,
        trim:true,
        require:true
    },
    email:{
        type:String,
        unique:true,
        require:true,
        trim:true
    },
    telefono:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        default:null
    },
    fechaNacimiento:{
        type:Date,
        require:true
    },
    contrasenia:{
        type:String,
        require:true
    },
    confirmarEmail:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
        default:null,
    },
    status:{
        type:Boolean,
        default:true
    },
    calificacion:{
        type:Number,
        default:null
    }
},{
    timestamps:true
})

ClienteSchema.methods.EncriptarContrasenia = async (password) =>{
    const nivelSal = 10
    const contraEncriptada = await bcrypt.hash(password, nivelSal)
    return contraEncriptada
}

ClienteSchema.methods.CompararContrasenia = async (password) =>{
    const Comparacion = await bcrypt.compare(password, this.password)
    return Comparacion
}

ClienteSchema.methods.GenerarToken = function(){
    const tokenSesion=this.token = Math.random().toString(36).slice(2)
    return tokenSesion
}

export default model('Cliente', ClienteSchema)