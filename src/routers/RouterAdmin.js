import { Router } from "express";
import { confirmarEmail, 
    login, 
    register, 
    RecuperarContraseña, 
    ComprobarParaRestablecer, 
    ActualizarPerfilAdministrador,
    ActualizarContrasenia, 
    Perfil,
    SubidaFoto,
    VerificacionFoto} from "../controllers/ControladorAdmin.js";
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
router.get('/ver-foto-admin', verificarAutenticacion, VerificacionFoto)

export default router