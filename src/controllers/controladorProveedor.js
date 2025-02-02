import Proveedor from "../modules/ModeloProveedor.js";
import { sendMailToAdmin, sendMailToAdminRestore } from "../config/nodemailer.js";
import generarJWT from "../helpers/crearJWT.js"
//import { LiaEtsy } from "react-icons/lia";
import mongoose from "mongoose";


const registroProve = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const verificarEmailBDD = await Proveedor.findOne({ email })
    if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos el email ya se encuentra registrado" })

    const nuevoProve = new Proveedor(req.body)
    nuevoProve.contrasenia = await nuevoProve.EncriptarContrasenia(contrasenia)

    const token = nuevoProve.GenerarToken()
    sendMailToAdmin(email, token)

    await nuevoProve.save()

    res.status(200).json({ msg: "Revisa tu correo electronico para confirmar tu cuenta" })
}
const confirmarEmail = async (req, res) => {
    const { token } = req.params

    if (!(token)) return res.status(400).json({ msg: "Lo sentimos no se puede validar la cuenta" })

    const ProveedorBDD = await Proveedor.findOne({ token })
    if (!ProveedorBDD?.token) return res.status(400).json({ msg: "La cuenta ya a sido confirmada" })

    ProveedorBDD.token = null
    ProveedorBDD.confirmarEmail = true
    await ProveedorBDD.save()
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}
const loginProve = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debe llenar todos los campos" })

    const ProveedorBDD = await Proveedor.findOne({ email })
    if (ProveedorBDD?.confirmarEmail == false) return res.status(400).json({ msg: "Lo sentimos, debe verificar su cuenta" })
    if (!ProveedorBDD) return res.status(403).json({ msg: "Lo sentimos, el proveedor no se encuentra registrado" })

    const verificarPassword = await ProveedorBDD.CompararContra(contrasenia)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, la contraseña no es correcta" })

    const token = generarJWT(ProveedorBDD._id, "Proveedor")
    
    res.status(200).json({
        ProveedorBDD,
        token
    })
}

const ActualizarPerfilProveedor = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const ProveedorBDD = await Proveedor.findOne({ email })
    if (!ProveedorBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    Object.keys(req.body).forEach((key) => {
        if (key !== "contrasenia" && req.body[key]) {
            ProveedorBDD[key] = req.body[key];
        }
    });
    await ProveedorBDD.save()
    res.status(200).json({ msg: "Cambios guardados", ProveedorBDD })
}

const ActualizarContraseniaProve = async(req, res)=>{
    const {email, contrasenia, nuevaContrasenia} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const ProveedorBDD = await Proveedor.findOne({email})
    if (!ProveedorBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    const Verificacion = await ProveedorBDD.CompararContra(contrasenia)
    if(!Verificacion) return res.status(404).json({msg:"La contraseña actual no es correcta"})
    const EncriptarContra = await ProveedorBDD.EncriptarContrasenia(nuevaContrasenia)
    ProveedorBDD.contrasenia = EncriptarContra
    await ProveedorBDD.save()
    res.status(200).json({msg:"Contraseña actualizada"})
}
//-----------------------------------------------------------------------------------------------
const RecuperarContrasenia = async (req, res) =>{
    const {email} = req.body
    if(Object.values(req.body).includes("")) return res.status(404).json({msg:"Por favor, ingrese su correo"})
    const ProveedorBDD = await Proveedor.findOne({email})
    if(!ProveedorBDD) return res.status(404).json({msg:"La cuenta no existe"})
    ProveedorBDD.token = ProveedorBDD.GenerarToken()
    sendMailToAdminRestore(email, ProveedorBDD.token)
    await ProveedorBDD.save()
    res.status(200).json({msg:"Se ha enviado a su correo un enlace para restablecer la contraseña"})
}

const ConfirmarRecuperarContrasenia = async (req, res) =>{
    const {token} = req.params
    const {email, contrasenia} = req.body
    if(!(token)) return res.status(404).json({msg:"Token no identificado"})
    if(Object.values(req.body).includes("")) return res.status(404).json({msg:"Por favor, ingrese sus nuevas credenciales"})
    const ProveedorBDD = await Proveedor.findOne({email})
    if(!ProveedorBDD) return res.status(404).json({msg:"La cuenta no existe, correo inexistente"})    
    if(ProveedorBDD?.token !== token) return res.status(404).json({msg:"Token no autorizado"})
    const nuevaContrasenia = await ProveedorBDD.EncriptarContrasenia(contrasenia)
    ProveedorBDD.contrasenia = nuevaContrasenia
    ProveedorBDD.token = null
    ProveedorBDD.status = true
    await ProveedorBDD.save()
    res.status(200).json({msg:"Contraseña restablecida con éxito"})
}

const detalleProveedor = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const proveedorBDD = await Proveedor.findById(id).select("-password")
    if(!proveedorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el proveedor ${id}`})
    res.status(200).json({msg:proveedorBDD})
}



const Perfil = async (req, res) =>{
    delete req.ProveedorBDD.token
    delete req.ProveedorBDD.confirmEmail
    delete req.ProveedorBDD.createdAt
    delete req.ProveedorBDD.updatedAt
    delete req.ProveedorBDD.__v
    res.status(200).json(req.ProveedorBDD)
}

/* Para Sprint 4
const HistorialTrabajos = async (req, res) =>{
    const {proveedor} = req.params
    const TrabajosBDD = await Trabajos.find({proveedor})
    if(!TrabajosBDD.length) return res.status(404).json({msg:"El proveedor no ha realizado trabajos"})
    await TrabajosBDD.save()
    res.status(200).json({TrabajosBDD})
}

const MostrarTrabajosAgendados = async (req, res) =>{
    const {proveedor} = req.params
    const status = "Agendada"
    const TrabajosBDD = await Trabajos.find({proveedor, status})
    if(!TrabajosBDD.length) return res.status(404).json({msg:"El proveedor no tiene trabajos agendados"})
    await TrabajosBDD.save()
    res.status(200).json(TrabajosBDD)
}

const CancelarTrabajosAgendados = async (req, res) =>{
    const {_id, nuevoStatus} = req.body
    const TrabajosBDD = await Trabajos.findOne({_id})
    if(!TrabajosBDD) return res.status(404).json({msg:"El trabajo señalado no existe"})
    TrabajosBDD.status = nuevoStatus
    await TrabajosBDD.save()
    res.status(200).json({msg:"El trabajo a sido cancelado"})
}
*/


export {
    registroProve,
    Perfil,
    confirmarEmail,
    loginProve,
    ActualizarPerfilProveedor,
    ActualizarContraseniaProve,
    RecuperarContrasenia,
    ConfirmarRecuperarContrasenia,
    detalleProveedor
}