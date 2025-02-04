import ModeloCliente from "../modules/ModeloCliente.js";
import { sendMailToAdmin, sendMailToAdminRestore } from "../config/nodemailer.js";
import generarJWT  from "../helpers/crearJWT.js";
import mongoose from "mongoose";

const registroCliente = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const verificarEmailBDD = await ModeloCliente.findOne({ email })
    if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos el email ya se encuentra registrado" })

    const nuevoCliente = new ModeloCliente(req.body)
    nuevoCliente.contrasenia = await nuevoCliente.EncriptarContrasenia(contrasenia)

    const token = nuevoCliente.GenerarToken()
    sendMailToAdmin(email, token)

    await nuevoCliente.save()

    res.status(200).json({ msg: "Revisa tu correo electronico para confirmar tu cuenta" })
}
const confirmarEmail = async (req, res) => {
    const { token } = req.params

    if (!(token)) return res.status(400).json({ msg: "Lo sentimos no se puede validar la cuenta" })

    const ClienteBDD = await ModeloCliente.findOne({ token })
    if (!ClienteBDD?.token) return res.status(400).json({ msg: "La cuenta ya a sido confirmada" })

    ClienteBDD.token = null
    ClienteBDD.confirmarEmail = true
    await ClienteBDD.save()
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}

const loginCliente = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debe llenar todos los campos" })

    const ClienteBDD = await ModeloCliente.findOne({ email })
    if (ClienteBDD?.confirmarEmail == false) return res.status(400).json({ msg: "Lo sentimos, debe verificar su cuenta" })
    if (!ClienteBDD) return res.status(403).json({ msg: "Lo sentimos, el cliente no se encuentra registrado" })

    const verificarPassword = await ClienteBDD.CompararPasswordCliente(contrasenia)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, la contraseña no es correcta" })

    const token = generarJWT(ClienteBDD._id, "cliente")
    
    const {_id} = ClienteBDD
    
    res.status(200).json({
        token,
        _id,
        rol:'cliente'
    })
}

const ActualizarPerfilCliente = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const ClienteBDD = await ModeloCliente.findOne({ email })
    if (!ClienteBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    Object.keys(req.body).forEach((key) => {
        if (key !== "contrasenia" && req.body[key]) {
            ClienteBDD[key] = req.body[key];
        }
    });
    await ClienteBDD.save()
    res.status(200).json({ msg: "Cambios guardados", ClienteBDD })
}

const ActualizarContraseniaCliente = async(req, res)=>{
    const {email, contrasenia, nuevaContrasenia} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const ClienteBDD = await ModeloCliente.findOne({email})
    if (!ClienteBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    const Verificacion = await ClienteBDD.CompararPasswordCliente(contrasenia)
    if(!Verificacion) return res.status(404).json({msg:"La contraseña actual no es correcta"})
    const EncriptarContra = await ClienteBDD.EncriptarContrasenia(nuevaContrasenia)
    ClienteBDD.contrasenia = EncriptarContra
    await ClienteBDD.save()
    res.status(200).json({msg:"Contraseña actualizada"})
}

const RecuperarContrasenia = async (req, res) =>{
    const {email} = req.body
    if(Object.values(req.body).includes("")) return res.status(404).json({msg:"Por favor, ingrese su correo"})
    const ClienteBDD = await ModeloCliente.findOne({email})
    if(!ClienteBDD) return res.status(404).json({msg:"La cuenta no existe"})
    ClienteBDD.token = ClienteBDD.GenerarToken()
    sendMailToAdminRestore(email, ClienteBDD.token)
    await ClienteBDD.save()
    res.status(200).json({msg:"Se ha enviado a su correo un enlace para restablecer la contraseña"})
}

const ConfirmarRecuperarContrasenia = async (req, res) =>{
    const {token} = req.params
    const {email, contrasenia} = req.body
    if(!(token)) return res.status(404).json({msg:"Token no identificado"})
    if(Object.values(req.body).includes("")) return res.status(404).json({msg:"Por favor, ingrese sus nuevas credenciales"})
    const ClienteBDD = await ModeloCliente.findOne({email})
    if(!ClienteBDD) return res.status(404).json({msg:"La cuenta no existe, correo inexistente"})    
    if(ClienteBDD?.token !== token) return res.status(404).json({msg:"Token no autorizado"})
    const nuevaContrasenia = await ClienteBDD.EncriptarContrasenia(contrasenia)
    ClienteBDD.contrasenia = nuevaContrasenia
    ClienteBDD.token = null
    ClienteBDD.status = true
    await ClienteBDD.save()
    res.status(200).json({msg:"Contraseña restablecida con éxito"})
}


const detalleCliente = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    const ClienteBDD = await ModeloCliente.findById(id).select("-password")
    if(!ClienteBDD) return res.status(404).json({msg:`Lo sentimos, no existe el cliente ${id}`})
    res.status(200).json({msg:ClienteBDD})
}


const Perfil = async (req, res) =>{
    delete req.clienteBDD.token
    delete req.clienteBDD.confirmEmail
    delete req.clienteBDD.createdAt
    delete req.clienteBDD.updatedAt
    delete req.clienteBDD.__v
    res.status(200).json(req.clienteBDD)
}

export {
    registroCliente,
    Perfil,
    confirmarEmail,
    loginCliente,
    ActualizarPerfilCliente,
    ActualizarContraseniaCliente,
    RecuperarContrasenia,
    ConfirmarRecuperarContrasenia,
    detalleCliente
}