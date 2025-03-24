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

    res.status(200).json({ msg: "Revisa tu correo electronico para confirmar tu cuenta", rol: nuevoProve.rol })
}
const confirmarEmail = async (req, res) => {
    const { token } = req.params

    if (!(token)) return res.status(400).json({ msg: "Lo sentimos no se puede validar la cuenta" })

    const proveedorBDD = await Proveedor.findOne({ token })
    if (!proveedorBDD?.token) return res.status(400).json({ msg: "La cuenta ya a sido confirmada" })

    proveedorBDD.token = null
    proveedorBDD.confirmarEmail = true
    await proveedorBDD.save()
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}
const loginProve = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debe llenar todos los campos" })

    const proveedorBDD = await Proveedor.findOne({ email })
    if (proveedorBDD?.confirmarEmail == false) return res.status(400).json({ msg: "Lo sentimos, debe verificar su cuenta" })
    if (!proveedorBDD) return res.status(403).json({ msg: "Lo sentimos, el proveedor no se encuentra registrado" })

    const verificarPassword = await proveedorBDD.CompararContra(contrasenia)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, la contraseña no es correcta" })

    const token = generarJWT(proveedorBDD._id, "proveedor")

    const { _id } = proveedorBDD

    res.status(200).json({
        token,
        _id,
        rol: 'proveedor'
    })
}

const ActualizarPerfilProveedor = async (req, res) => {
    const { email } = req.proveedorBDD
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const proveedorBDD = await Proveedor.findOne({ email })
    if (!proveedorBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    Object.keys(req.body).forEach((key) => {
        if (key !== "contrasenia" && req.body[key]) {
            proveedorBDD[key] = req.body[key];
        }
    });
    await proveedorBDD.save()
    res.status(200).json({ msg: "Cambios guardados", proveedorBDD })
}

const ActualizarContraseniaProve = async (req, res) => {
    const { email } = req.proveedorBDD
    const { contrasenia, nuevaContrasenia } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const proveedorBDD = await Proveedor.findOne({ email })
    if (!proveedorBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    const Verificacion = await proveedorBDD.CompararContra(contrasenia)
    if (!Verificacion) return res.status(404).json({ msg: "La contraseña actual no es correcta" })
    const EncriptarContra = await proveedorBDD.EncriptarContrasenia(nuevaContrasenia)
    proveedorBDD.contrasenia = EncriptarContra
    await proveedorBDD.save()
    res.status(200).json({ msg: "Contraseña actualizada" })
}
//-----------------------------------------------------------------------------------------------
const RecuperarContrasenia = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Por favor, ingrese su correo" })
    const proveedorBDD = await Proveedor.findOne({ email })
    if (!proveedorBDD) return res.status(404).json({ msg: "La cuenta no existe" })
    proveedorBDD.token = proveedorBDD.GenerarToken()
    sendMailToAdminRestore(email, proveedorBDD.token)
    await proveedorBDD.save()
    res.status(200).json({ msg: "Se ha enviado a su correo un enlace para restablecer la contraseña" })
}

const ConfirmarRecuperarContrasenia = async (req, res) => {
    const { token } = req.params
    const { email, contrasenia } = req.body
    if (!(token)) return res.status(404).json({ msg: "Token no identificado" })
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Por favor, ingrese sus nuevas credenciales" })
    const proveedorBDD = await Proveedor.findOne({ email })
    if (!proveedorBDD) return res.status(404).json({ msg: "La cuenta no existe, correo inexistente" })
    if (proveedorBDD?.token !== token) return res.status(404).json({ msg: "Token no autorizado" })
    const nuevaContrasenia = await proveedorBDD.EncriptarContrasenia(contrasenia)
    proveedorBDD.contrasenia = nuevaContrasenia
    proveedorBDD.token = null
    proveedorBDD.status = true
    await proveedorBDD.save()
    res.status(200).json({ msg: "Contraseña restablecida con éxito" })
}

const detalleProveedor = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
    const proveedorBDD = await Proveedor.findById(id).select("-password")
    if (!proveedorBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el proveedor ${id}` })
    res.status(200).json(proveedorBDD)
}

const AgregarUbicacion = async (req, res) => {
    try {
        const { email } = req.proveedorBDD
        const { longitude, latitude } = req.body
        const usuario = await Proveedor.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: "Lo sentimos, no existe el proveedor" })
        usuario.ubicacion.latitud = latitude
        usuario.ubicacion.longitud = longitude
        await usuario.save()
        res.status(200).json({ msg: "Ubicación guardada con éxito" })
    } catch (error) {
        res.status(404).json({ msg: "Error al actualizar la ubicación", error: error.message })
    }
}

const VerificarUbicacion = async (req, res) => {
    try {
        const { email } = req.proveedorBDD
        const usuario = await Proveedor.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: "Lo sentimos, no existe el proveedor" })
        const latitud = usuario.ubicacion.latitud
        const longitud = usuario.ubicacion.longitud

        if (latitud === null || longitud === null) return res.status(200).json({ msg: "No" })
        if (latitud !== null && longitud !== null) return res.status(200).json({ msg: "Si" })
    } catch (error) {
        res.status(404).json({ msg: "Error al verificar la ubicación", error: error.message })
    }
}

const ObtenerUbicacion = async (req, res) =>{
    try {
        const {email} = req.proveedorBDD
        const usuario = await Proveedor.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: "Lo sentimos, no existe el proveedor" })
        const ubicacion = usuario.ubicacion
        if(ubicacion.latitud === null || ubicacion.longitud === null) return res.status(404).json({msg:"No se ha registrado la ubicación"})
        res.status(200).json(ubicacion)
    } catch (error) {
        res.status(404).json({msg:"Error al obtener la ubicación", error:error.message})
    }
}


const Perfil = (req, res) => {
    delete req.proveedorBDD.token
    delete req.proveedorBDD.confirmEmail
    delete req.proveedorBDD.createdAt
    delete req.proveedorBDD.updatedAt
    delete req.proveedorBDD.__v
    res.status(200).json(req.proveedorBDD)
}

export {
    registroProve,
    Perfil,
    confirmarEmail,
    loginProve,
    ActualizarPerfilProveedor,
    ActualizarContraseniaProve,
    RecuperarContrasenia,
    ConfirmarRecuperarContrasenia,
    detalleProveedor,
    AgregarUbicacion,
    VerificarUbicacion,
    ObtenerUbicacion
}