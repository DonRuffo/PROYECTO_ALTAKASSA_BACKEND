import ModuloUsuario from "../modules/ModuloUsuario.js";
import { sendMailToAdmin, sendMailToAdminRestore } from "../config/nodemailer.js";
import generarJWT from "../helpers/crearJWT.js";
import mongoose from "mongoose";

const registroUsuario = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const verificarEmailBDD = await ModuloUsuario.findOne({ email })
    if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos el email ya se encuentra registrado" })

    const nuevoUsuario = new ModuloUsuario(req.body)
    nuevoUsuario.contrasenia = await nuevoUsuario.EncriptarContrasenia(contrasenia)

    const token = nuevoUsuario.GenerarToken()
    await nuevoUsuario.save()

    await sendMailToAdmin(email, token)

    res.status(200).json({ msg: "Revisa tu correo electronico para confirmar tu cuenta", rol: nuevoUsuario.rol })
}
const confirmarEmail = async (req, res) => {
    const { token } = req.params

    if (!(token)) return res.status(400).json({ msg: "Lo sentimos no se puede validar la cuenta" })

    const UsuarioBDD = await ModuloUsuario.findOne({ token })
    if (!UsuarioBDD?.token) return res.status(400).json({ msg: "La cuenta ya a sido confirmada" })

    UsuarioBDD.token = null
    UsuarioBDD.confirmarEmail = true
    await UsuarioBDD.save()
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}

const loginUsuario = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debe llenar todos los campos" })

    const UsuarioBDD = await ModuloUsuario.findOne({ email })
    if (UsuarioBDD?.confirmarEmail == false) return res.status(400).json({ msg: "Lo sentimos, debe verificar su cuenta" })
    if (!UsuarioBDD) return res.status(403).json({ msg: "Lo sentimos, el Usuario no se encuentra registrado" })

    const verificarPassword = await UsuarioBDD.CompararPasswordUsuario(contrasenia)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, la contraseña no es correcta" })

    const token = generarJWT(UsuarioBDD._id, "usuario")

    const { _id } = UsuarioBDD

    res.status(200).json({
        token,
        _id,
        rol: 'usuario'
    })
}

const ActualizarPerfilUsuario = async (req, res) => {
    const { email } = req.usuarioBDD
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const UsuarioBDD = await ModuloUsuario.findOne({ email })
    if (!UsuarioBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    Object.keys(req.body).forEach((key) => {
        if (key !== "contrasenia" && req.body[key]) {
            UsuarioBDD[key] = req.body[key];
        }
    });
    await UsuarioBDD.save()
    res.status(200).json({ msg: "Cambios guardados", UsuarioBDD })
}

const ActualizarContraseniaUsuario = async (req, res) => {
    const { email } = req.usuarioBDD
    const { contrasenia, nuevaContrasenia } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const UsuarioBDD = await ModuloUsuario.findOne({ email })
    if (!UsuarioBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    const Verificacion = await UsuarioBDD.CompararPasswordUsuario(contrasenia)
    if (!Verificacion) return res.status(404).json({ msg: "La contraseña actual no es correcta" })
    const EncriptarContra = await UsuarioBDD.EncriptarContrasenia(nuevaContrasenia)
    UsuarioBDD.contrasenia = EncriptarContra
    await UsuarioBDD.save()
    res.status(200).json({ msg: "Contraseña actualizada" })
}

const RecuperarContrasenia = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Por favor, ingrese su correo" })
    const UsuarioBDD = await ModuloUsuario.findOne({ email })
    if (!UsuarioBDD) return res.status(404).json({ msg: "La cuenta no existe" })
    UsuarioBDD.token = UsuarioBDD.GenerarToken()
    sendMailToAdminRestore(email, UsuarioBDD.token)
    await UsuarioBDD.save()
    res.status(200).json({ msg: "Se ha enviado a su correo un enlace para restablecer la contraseña" })
}

const ConfirmarRecuperarContrasenia = async (req, res) => {
    const { token } = req.params
    const { email, contrasenia } = req.body
    if (!(token)) return res.status(404).json({ msg: "Token no identificado" })
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Por favor, ingrese sus nuevas credenciales" })
    const UsuarioBDD = await ModuloUsuario.findOne({ email })
    if (!UsuarioBDD) return res.status(404).json({ msg: "La cuenta no existe, correo inexistente" })
    if (UsuarioBDD?.token !== token) return res.status(404).json({ msg: "Token no autorizado" })
    const nuevaContrasenia = await UsuarioBDD.EncriptarContrasenia(contrasenia)
    UsuarioBDD.contrasenia = nuevaContrasenia
    UsuarioBDD.token = null
    UsuarioBDD.status = true
    await UsuarioBDD.save()
    res.status(200).json({ msg: "Contraseña restablecida con éxito" })
}


const detalleUsuario = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
    const UsuarioBDD = await ModuloUsuario.findById(id).select("-password")
    if (!UsuarioBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el Usuario ${id}` })
    res.status(200).json({ msg: UsuarioBDD })
}

const AgregarUbicacionActual = async (req, res) => {
    try {
        const { email } = req.usuarioBDD
        const { longitude, latitude } = req.body
        if (!longitude || !latitude) return res.status(400).json({ msg: 'Geolocalización incompleta' })
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: "Lo sentimos, no existe el Usuario" })
        usuario.ubicacionActual.latitud = latitude
        usuario.ubicacionActual.longitud = longitude
        await usuario.save()
        res.status(200).json({ msg: "Ubicación guardada con éxito" })
    } catch (error) {
        res.status(404).json({ msg: "Error al actualizar la ubicación", error: error.message })
    }
}

const AgregarUbicacionTrabajo = async (req, res) => {
    try {
        const { email } = req.usuarioBDD
        const { longitude, latitude } = req.body
        if (!longitude || !latitude) return res.status(400).json({ msg: 'Geolocalización incompleta' })
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: "Lo sentimos, no existe el Usuario" })
        usuario.ubicacionTrabajo.latitud = latitude
        usuario.ubicacionTrabajo.longitud = longitude
        await usuario.save()
        res.status(200).json({ msg: "Ubicación guardada con éxito" })
    } catch (error) {
        res.status(404).json({ msg: "Error al actualizar la ubicación", error: error.message })
    }
}

const Perfil = async (req, res) => {
    delete req.usuarioBDD.token
    delete req.usuarioBDD.confirmEmail
    delete req.usuarioBDD.createdAt
    delete req.usuarioBDD.updatedAt
    delete req.usuarioBDD.__v
    res.status(200).json(req.usuarioBDD)
}

const SubidaFoto = async (req, res) => {
    try {
        const { email } = req.usuarioBDD
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' })
        const { secure_url } = req.body
        if (!secure_url) return res.status(404).json({ msg: 'No existe una url de Cloud' })
        usuario.f_perfil = secure_url
        await usuario.save()
        res.status(200).json({ msg: 'Imagen guardada' })
    } catch (error) {
        console.log('Hubo un error al subir la imagen', error)
    }
}

const verificarFoto = async (req, res) => {
    try {
        const { email } = req.usuarioBDD
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' })
        const foto = usuario.f_perfil
        if (foto === null) return res.status(200).json({ msg: 'No' })
        if (foto !== null) return res.status(200).json({ msg: 'Si' })
    } catch (error) {
        console.log('Error al intentar conectarse al servidor')
    }
}

const verificarUbicacionActual = async (req, res) => {
    try {
        const { email } = req.usuarioBDD
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' })
        const ubicacionLat = usuario.ubicacionActual.latitud
        const ubicacionLog = usuario.ubicacionActual.longitud

        if (ubicacionLat === null || ubicacionLog === null) return res.status(200).json({ msg: 'No' })
        if (ubicacionLat !== null && ubicacionLog !== null) return res.status(200).json({ msg: 'Si' })
    } catch (error) {
        console.log('Error al intentar conectarse al servidor')
    }
}

const verificarUbicacionTrabajo = async (req, res) => {
    try {
        const { email } = req.usuarioBDD
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' })
        const ubicacionLat = usuario.ubicacionTrabajo.latitud
        const ubicacionLog = usuario.ubicacionTrabajo.longitud

        if (ubicacionLat === null || ubicacionLog === null) return res.status(200).json({ msg: 'No' })
        if (ubicacionLat !== null && ubicacionLog !== null) return res.status(200).json({ msg: 'Si' })
    } catch (error) {
        console.log('Error al intentar conectarse al servidor')
    }
}

const obtenerUbicacion = async (req, res) => {
    try {
        const { email } = req.usuarioBDD
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' })
        const ubiActual = usuario.ubicacionActual
        if(!ubiActual) return res.status(404).json({msg:'No tiene ubicación almacenada'})
        res.status(200).json({ubiActual})
    } catch (error) {
        console.log('Error al intentar conectarse al servidor')
    }
}

export {
    registroUsuario,
    Perfil,
    confirmarEmail,
    loginUsuario,
    ActualizarPerfilUsuario,
    ActualizarContraseniaUsuario,
    RecuperarContrasenia,
    ConfirmarRecuperarContrasenia,
    detalleUsuario,
    AgregarUbicacionActual,
    AgregarUbicacionTrabajo,
    SubidaFoto,
    verificarFoto,
    verificarUbicacionActual,
    verificarUbicacionTrabajo,
    obtenerUbicacion
}