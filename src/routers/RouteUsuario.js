import { Router } from "express";
import { ActualizarContraseniaUsuario, ActualizarPerfilUsuario, AgregarUbicacion, confirmarEmail, ConfirmarRecuperarContrasenia, detalleUsuario, loginUsuario, obtenerUbicacion, Perfil, RecuperarContrasenia, registroUsuario, SubidaFoto, verificarFoto, verificarUbicacion } from "../controllers/ControladorUsuario.js";
import verificarAutenticacion from "../middleware/autenticacion.js";
import { listarOfertas } from "../controllers/controladorOfertas.js";

const routeUsuario = Router()

routeUsuario.post('/registroUser', registroUsuario)
routeUsuario.get('/confirmarUser/:token', confirmarEmail)
routeUsuario.post('/loginUser', loginUsuario)
routeUsuario.post('/recuperarPassUser', RecuperarContrasenia)
routeUsuario.post('/restablecerPassUser', ConfirmarRecuperarContrasenia)

//privadas
routeUsuario.get('/perfilUser', verificarAutenticacion, Perfil)
routeUsuario.put('/actualizarPerfilUser', verificarAutenticacion, ActualizarPerfilUsuario)
routeUsuario.put('/actualizarPassUser', verificarAutenticacion, ActualizarContraseniaUsuario)
routeUsuario.get('/detalleUser', verificarAutenticacion, detalleUsuario)
routeUsuario.get('/listarOfertas', verificarAutenticacion, listarOfertas)
routeUsuario.post('/guardar-ubicacion-user', verificarAutenticacion, AgregarUbicacion)
routeUsuario.post('/fotoUser', verificarAutenticacion, SubidaFoto)
routeUsuario.get('/verFotoUser', verificarAutenticacion, verificarFoto)
routeUsuario.get('/verUbiUser', verificarAutenticacion, verificarUbicacion)
routeUsuario.get('/ubiUser', verificarAutenticacion, obtenerUbicacion)

export default routeUsuario