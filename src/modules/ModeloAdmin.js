import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const AdministradorSchema = new Schema({
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
        require:true,
        default:null
    },
    telefono:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        default:null
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true
    },
    rol:{
        type:String,
        default:'administrador'
    },
    contrasenia:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    f_perfil:{
        type:String,
        default:null
    }
},{
    timestamps:true
})

//Encriptación para administrador

AdministradorSchema.methods.EncriptarContraAdmin = async function(password){
    const nivelSal = await bcrypt.genSalt(10)
    const ContraEncriptada = await bcrypt.hash(password, nivelSal)
    return ContraEncriptada
}

//Comparacion de contraseñas
AdministradorSchema.methods.CompararContra = async function (password){
    const comparacion = bcrypt.compare(password, this.contrasenia)
    return comparacion
}

//Creacion de token
AdministradorSchema.methods.GeneradorToken = function(){
    const tokenSesion=this.token = Math.random().toString(36).slice(2)
    return tokenSesion
}



export default model('Administrador', AdministradorSchema)