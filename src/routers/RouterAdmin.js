import { Router } from "express";
import { confirmarEmail, 
    login, 
    register, 
    RecuperarContraseña, 
    ComprobarParaRestablecer, 
    ActualizarPerfilAdministrador,
    ActualizarContrasenia } from "../controllers/ControladorAdmin.js";


const router = Router()

router.post('/registro',register)

router.get('/confirmar/:token',confirmarEmail)

router.post('/login', login)

router.post('/recuperar-contrasenia', RecuperarContraseña)

router.get('/restablecer-contrasenia/:token', ComprobarParaRestablecer)

router.post('/actualizar-perfil', ActualizarPerfilAdministrador)

router.post('/actualizar-contrasenia', ActualizarContrasenia)

export default router