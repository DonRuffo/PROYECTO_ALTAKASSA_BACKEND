import { sendMailToAdmin, sendMailToAdminRestore } from "../config/nodemailer.js";
import ModeloAdmin from "../modules/ModeloAdmin.js";
import generarJWT from "../helpers/crearJWT.js";
//import { LiaEtsy } from "react-icons/lia";

const register = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const verificarEmailBDD = await ModeloAdmin.findOne({ email })
    if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos el email ya se encuentra registrado" })

    const nuevoAdmin = new ModeloAdmin(req.body)
    nuevoAdmin.contrasenia = await nuevoAdmin.EncriptarContraAdmin(contrasenia)

    const token = nuevoAdmin.GeneradorToken()
    sendMailToAdmin(email, token)

    await nuevoAdmin.save()

    res.status(200).json({ msg: "Revisa tu correo electronico para confirmar tu cuenta" })
}
const confirmarEmail = async (req, res) => {
    const { token } = req.params

    if (!(token)) return res.status(400).json({ msg: "Lo sentimos no se puede validar la cuenta" })

    const AdminBDD = await ModeloAdmin.findOne({ token })
    if (!AdminBDD?.token) return res.status(400).json({ msg: "La cuenta ya a sido confirmada" })

    AdminBDD.token = null
    AdminBDD.confirmEmail = true
    await AdminBDD.save()
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}
const login = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debe llenar todos los campos" })

    const AdminBDD = await ModeloAdmin.findOne({ email })
    if (AdminBDD?.confirmEmail == false) return res.status(400).json({ msg: "Lo sentimos, debe verificar su cuenta" })
    if (!AdminBDD) return res.status(403).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })

    const verificarPassword = await AdminBDD.CompararContra(contrasenia)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, la contraseña no es correcta" })

    const token = generarJWT(AdminBDD._id, "Administrador")

    const nuevoToken = {
        AdminBDD,
        token,
        rol:'administrador'
    }
    res.status(200).json(nuevoToken)
}

const RecuperarContraseña = async (req, res) => {
    const { email } = req.body
    const AdminBDD = await ModeloAdmin.findOne({ email })
    if (!AdminBDD) return res.status(404).json({ msg: "La cuenta indicada no existe" })
    AdminBDD.token = AdminBDD.GeneradorToken()
    sendMailToAdminRestore(AdminBDD.email, AdminBDD.token)
    await AdminBDD.save()
    res.status(200).json({ msg: "Se ha enviado un correo para restablecer su contraseña" })
}

const ComprobarParaRestablecer = async (req, res) => {
    const { token } = req.params
    const { contrasenia, email } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Ingrese sus credenciales" })
    const AdminBDD = await ModeloAdmin.findOne({ email })
    if (!AdminBDD) return res.status(404).json({ msg: "La cuenta indicada no existe" })
    if (token !== AdminBDD.token) return res.status(404).json({ msg: "No se restablecer la contraseña" })
    const Encriptamiento = await AdminBDD.EncriptarContraAdmin(contrasenia)
    AdminBDD.contrasenia = Encriptamiento
    AdminBDD.token = null
    AdminBDD.status = true
    await AdminBDD.save()
    res.status(200).json({ msg: "Contraseña restablecida exitosamente" })
}

const ActualizarPerfilAdministrador = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const AdminBDD = await ModeloAdmin.findOne({ email })
    if (!AdminBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    Object.keys(req.body).forEach((key) => {
        if (key !== "contrasenia" && req.body[key]) {
            AdminBDD[key] = req.body[key];
        }
    });
    await AdminBDD.save()
    res.status(200).json({ msg: "Cambios guardados", AdminBDD })
}

const ActualizarContrasenia = async(req, res)=>{
    const {email, contrasenia, nuevaContrasenia} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const AdminBDD = await ModeloAdmin.findOne({email})
    if (!AdminBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    const Verificacion = await AdminBDD.CompararContra(contrasenia)
    if(!Verificacion) return res.status(404).json({msg:"La contraseña actual no es correcta"})
    const EncriptarContra = await AdminBDD.EncriptarContraAdmin(nuevaContrasenia)
    AdminBDD.contrasenia = EncriptarContra
    await AdminBDD.save()
    res.status(200).json({msg:"Contraseña actualizada"})
}

const Perfil = async (req, res) =>{
    delete req.AdminBDD.token
    delete req.AdminBDD.confirmEmail
    delete req.AdminBDD.createdAt
    delete req.AdminBDD.updatedAt
    delete req.AdminBDD.__v
    res.status(200).json(req.AdminBDD)
}

export {
    register,
    confirmarEmail,
    login,
    RecuperarContraseña,
    ComprobarParaRestablecer,
    ActualizarPerfilAdministrador,
    ActualizarContrasenia,
    Perfil
}