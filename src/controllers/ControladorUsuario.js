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

    res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta", rol: nuevoUsuario.rol })
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
    if (!UsuarioBDD) return res.status(403).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })

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
    if( contrasenia === nuevaContrasenia) return res.status(404).json({ msg: "La nueva contraseña no puede ser igual a la actual" })
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
    await UsuarioBDD.save()

    await sendMailToAdminRestore(email, UsuarioBDD.token)

    res.status(200).json({ msg: "Se ha enviado a su correo un enlace para restablecer la contraseña" })
}

const ConfirmarRecuperarContrasenia = async (req, res) => {
    const { token } = req.params
    const { contrasenia } = req.body
    if (!(token)) return res.status(404).json({ msg: "Token no identificado" })
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Ingrese su nueva contraseña" })
    const UsuarioBDD = await ModuloUsuario.findOne({ token })
    if (!UsuarioBDD) return res.status(404).json({ msg: "La cuenta no existe, correo inexistente" })
    if (UsuarioBDD?.token !== token) return res.status(404).json({ msg: "Token no autorizado" })
    const nuevaContrasenia = await UsuarioBDD.EncriptarContrasenia(contrasenia)
    UsuarioBDD.contrasenia = nuevaContrasenia
    UsuarioBDD.token = null
    UsuarioBDD.status = true
    await UsuarioBDD.save()
    res.status(200).json({ msg: "Contraseña restablecida" })
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
        const geoLo = {
            latitude,
            longitude
        }
        const encriptado = await usuario.EncriptarUbicacion(geoLo)
        usuario.ubicacionActual = encriptado.datos
        await usuario.save()
        res.status(200).json({ msg: "Ubicación guardada con éxito", iv: encriptado.iv })
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
        const geoLo = {
            latitude,
            longitude
        }
        const encriptado = await usuario.EncriptarUbicacion(geoLo)
        usuario.ubicacionTrabajo = encriptado.datos
        usuario.ivTra = encriptado.iv
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
        const { secure_url, public_id } = req.body
        if (!secure_url || !public_id) return res.status(404).json({ msg: 'No existe una url de Cloud' })
        usuario.f_perfil = secure_url
        usuario.publicId = public_id
        await usuario.save()
        res.status(200).json({ msg: 'Foto subida' })
    } catch (error) {
        console.log('Hubo un error al subir la imagen', error)
    }
}

const ObtenerPublicId = async (req, res) => {
    try {
        const {id} = req.params
        if(!id) return res.status(404).json({msg:"Id no encontrado"})
        const usuario = await ModuloUsuario.findById(id)
        if(!usuario) return res.status(404).json({msg:"Usuario no encontrado"})

        const publicId = usuario.publicId
        res.status(200).json({publicId})
    } catch (error) {
        res.status(500).json({error})
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
        const ubicacion = usuario.ubicacionActual
        if (ubicacion === null) return res.status(200).json({ msg: 'No' })
        if (ubicacion !== null) return res.status(200).json({ msg: 'Si' })
    } catch (error) {
        console.log('Error al intentar conectarse al servidor')
    }
}

const verificarUbicacionTrabajo = async (req, res) => {
    try {
        const { email } = req.usuarioBDD
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' })
        const ubicacion = usuario.ubicacionTrabajo
        if (ubicacion === null) return res.status(200).json({ msg: 'No' })
        if (ubicacion !== null) return res.status(200).json({ msg: 'Si' })
    } catch (error) {
        console.log('Error al intentar conectarse al servidor')
    }
}

const obtenerUbicacion = async (req, res) => {
    try {
        const { email } = req.usuarioBDD
        const iv = req.query.iv
        if (!iv) return res.status(404).json({ msg: "No llega el iv" })
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' })
        const ubiActual = usuario.ubicacionActual
        if (!ubiActual) return res.status(404).json({ msg: 'No tiene ubicación almacenada' })
        const desencriptado = await usuario.DesencriptarUbi(ubiActual, iv)
        res.status(200).json({ ubiActual, desencriptado })
    } catch (error) {
        console.log('Error al intentar conectarse al servidor')
    }
}

const obtenerUbicacionTrabajo = async (req, res) => {
    try {
        const email = req.query.prov
        const usuario = await ModuloUsuario.findOne({ email })
        if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' })
        const iv = usuario.ivTra
        const ubiTra = usuario.ubicacionTrabajo
        const desencriptado = await usuario.DesencriptarUbi(ubiTra, iv)
        res.status(200).json({ desencriptado })
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener la ubicación" })
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
    obtenerUbicacion,
    obtenerUbicacionTrabajo,
    ObtenerPublicId
}