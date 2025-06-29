import { sendMailToAdmin, sendMailToAdminRestore } from "../config/nodemailer.js";
import ModeloAdmin from "../modules/ModeloAdmin.js";
import ModeloPlanes from "../modules/ModeloPlanes.js";
import generarJWT from "../helpers/crearJWT.js";
import ModuloUsuario from "../modules/ModuloUsuario.js";
import ModeloOfertas from "../modules/ModeloOfertas.js";
import ModeloSugerencias from "../modules/ModeloSugerencias.js";

const register = async (req, res) => {
    const { email, contrasenia } = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const verificarEmailBDD = await ModeloAdmin.findOne({ email })
    if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos el email ya se encuentra registrado" })

    const nuevoAdmin = new ModeloAdmin(req.body)
    nuevoAdmin.contrasenia = await nuevoAdmin.EncriptarContraAdmin(contrasenia)

    const token = nuevoAdmin.GeneradorToken()
    await nuevoAdmin.save()
    await sendMailToAdmin(email, token)

    res.status(200).json({ msg: "Revisa tu correo electronico para confirmar tu cuenta", rol: nuevoAdmin.rol })
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
    try {
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debe llenar todos los campos" })

        const userAd = await ModuloUsuario.findOne({ email })
        const comparacion = await userAd.CompararPasswordUsuario(contrasenia);

        if(comparacion) {
            const token = generarJWT(userAd._id, 'administrador');
            const {_id} = userAd
            res.status(200).json({ token, _id, rol: 'administrador' });
        }else{
            res.status(404).json({ msg: "Credenciales incorrectas" })
        }
    } catch (error) {
        console.error(error)
    }
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
    const { email } = req.AdminBDD
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

const ActualizarContrasenia = async (req, res) => {
    const { email } = req.AdminBDD
    const { contrasenia, nuevaContrasenia } = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Llenar los campos vacíos" })
    const AdminBDD = await ModeloAdmin.findOne({ email })
    if (!AdminBDD) return res.status(404).json({ msg: "No existe esta cuenta" })
    const Verificacion = await AdminBDD.CompararContra(contrasenia)
    if (!Verificacion) return res.status(404).json({ msg: "La contraseña actual no es correcta" })
    const EncriptarContra = await AdminBDD.EncriptarContraAdmin(nuevaContrasenia)
    AdminBDD.contrasenia = EncriptarContra
    await AdminBDD.save()
    res.status(200).json({ msg: "Contraseña actualizada" })
}

const Perfil = (req, res) => {
    delete req.AdminBDD.token
    delete req.AdminBDD.confirmEmail
    delete req.AdminBDD.createdAt
    delete req.AdminBDD.updatedAt
    delete req.AdminBDD.__v
    res.status(200).json(req.AdminBDD)
}

const SubidaFoto = async (req, res) => {
    try {
        const { email } = req.AdminBDD
        const usuario = await ModeloAdmin.findOne({ email })
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

const crearPlan = async (req, res) => {
    try {
        const io = req.app.get('io')
        const { nombre, precio, creditos, descripcion } = req.body;

        if(Object.values(req.body).includes('')) return res.status(404).json({msg:"Debe llenar todos los campos"})

        const nuevoPlan = new ModeloPlanes({ nombre, precio, creditos, descripcion });
        await nuevoPlan.save();

        io.emit('Nuevo Plan', {nuevoPlan})
        res.status(200).json({ msg: "Plan creado correctamente", plan: nuevoPlan });

    } catch (error) {
        res.status(500).json({ msg: "Error al crear el plan", error })
    }
}

const obtenerPlanes = async (req, res) => {
    try {
        const planes = await ModeloPlanes.find();
        res.status(200).json(planes);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los planes", error })
    }
}

const obtenerPlan = async (req, res) =>{
    const {id} = req.params
    if(!id) return res.status(404).json({msg:'No existe el ID'})
    
    const plan = await ModeloPlanes.findById(id)
    if(!plan) return res.status(404).json({msg:'El plan no existe'})
    
    res.status(200).json(plan)
}

const actualizarPlan = async (req, res) => {
    const io = req.app.get('io')
    try {
        const { id } = req.params;
        const { nombre, precio, creditos, descripcion } = req.body;
        const planActualizado = await ModeloPlanes.findByIdAndUpdate(id, { nombre, precio, creditos, descripcion }, { new: true });
        if (!planActualizado) return res.status(404).json({ msg: "Plan no encontrado" });

        io.emit('Plan actualizado', {id, planActualizado})
        res.status(200).json({ msg: "Plan actualizado", plan: planActualizado });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el plan", error });;
    }
}

const eliminarPlan = async (req, res) => {
    const io = req.app.get('io')
    try {
        const { id } = req.params;
        const planEliminado = await ModeloPlanes.findByIdAndDelete(id);
        if (!planEliminado) return res.status(404).json({ msg: "Plan no encontrado" });
        io.emit('Plan eliminado', {id})
        res.status(200).json({ msg: "Plan eliminado correctamente" })
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el plan", error });
    }
}

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await ModuloUsuario.find().select('-contrasenia -ubicacionActual -ubicacionTrabajo -ivTra')
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({ msg: "Error al intentar obtener los usuarios", error })
    }
}

const eliminarUsuario = async (req, res) => {
    const { id } = req.params
    const io = req.app.get('io')
    try {
        const usuario = await ModuloUsuario.findByIdAndDelete(id)
        if (!usuario) return res.status(404).json({ msg: "No se encuentra el usuario" })
        await ModeloOfertas.deleteMany({proveedor:id})
        await ModeloTrabajos.deleteMany({proveedor:id})

        io.emit('Usuario eliminado', {id})
        res.status(200).json({ msg: "Usuario eliminado" })
    } catch (error) {
        console.log("Error al eliminar al usuario", error)
    }
}

const detallesDelUsuario = async(req, res) =>{
    const {id} = req.params
    if(!id) return res.status(404).json({msg:'No existe el id'})

    const usuario = await ModuloUsuario.findById(id)
    if(!usuario) return res.status(404).json({msg:'El usuario no existe'})
    
    const ofertas = await ModeloOfertas.find({proveedor:id})

    res.status(200).json({usuario, ofertas})
}

const verSugerencias = async (req, res) => {
    const sugerencias = await ModeloSugerencias.find()
    res.status(200).json(sugerencias);
}

const sugerenciasPorUsuario = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).json({ msg: 'No existe el ID' });

    const usuario = await ModuloUsuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: 'El usuario no existe' });

    const sugerencias = await ModeloSugerencias.find({ email: usuario.email });
    res.status(200).json(sugerencias);
}

export {
    register,
    confirmarEmail,
    crearPlan,
    obtenerPlanes,
    actualizarPlan,
    eliminarPlan,
    login,
    RecuperarContraseña,
    ComprobarParaRestablecer,
    ActualizarPerfilAdministrador,
    ActualizarContrasenia,
    Perfil,
    SubidaFoto,
    listarUsuarios,
    eliminarUsuario,
    obtenerPlan,
    detallesDelUsuario,
    verSugerencias,
    sugerenciasPorUsuario
}