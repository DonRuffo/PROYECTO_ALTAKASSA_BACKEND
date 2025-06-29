import { Router } from "express";
import {
    register,
    login, 
    RecuperarContraseña, 
    ComprobarParaRestablecer, 
    actualizarPlan,
    confirmarEmail,
    ActualizarPerfilAdministrador,
    ActualizarContrasenia, 
    Perfil,
    SubidaFoto,
    crearPlan,
    obtenerPlanes,
    eliminarPlan,
    listarUsuarios,
    eliminarUsuario,
    obtenerPlan,
    detallesDelUsuario,
    verSugerencias,
    sugerenciasPorUsuario,
} from "../controllers/ControladorAdmin.js";
import verificarAutenticacion from "../middleware/autenticacion.js";


const router = Router()

//publicas
router.post('/registro',register)
router.get('/confirmar/:token',confirmarEmail)
router.post('/login', login)
router.post('/recuperar-contrasenia', RecuperarContraseña)
router.get('/restablecer-contrasenia/:token', ComprobarParaRestablecer)

//privadas
router.get('/perfil-admin', verificarAutenticacion , Perfil)
router.put('/actualizar-perfil', verificarAutenticacion, ActualizarPerfilAdministrador)
router.put('/actualizar-contrasenia', verificarAutenticacion, ActualizarContrasenia)
router.post('/fotoAdmin', verificarAutenticacion, SubidaFoto)
router.post('/crearPlan', verificarAutenticacion ,crearPlan)
router.get('/obtenerPlanes', verificarAutenticacion, obtenerPlanes)
router.get('/obtenerPlan/:id', verificarAutenticacion, obtenerPlan)
router.put('/actualizarPlan/:id', verificarAutenticacion, actualizarPlan)
router.delete('/eliminarPlan/:id', verificarAutenticacion, eliminarPlan)
router.get('/listarUsuarios', verificarAutenticacion, listarUsuarios)
router.delete('/eliminarUser/:id', verificarAutenticacion, eliminarUsuario)
router.get('/detalleUsers/:id', verificarAutenticacion, detallesDelUsuario)
router.get('/verSugerencias', verificarAutenticacion, verSugerencias)
router.get('/sugerenciasPorUsuario/:id', verificarAutenticacion, sugerenciasPorUsuario)

export default router