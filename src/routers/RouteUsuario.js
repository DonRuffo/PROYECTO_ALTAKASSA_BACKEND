import { Router } from "express";
import { ActualizarContraseniaUsuario, ActualizarPerfilUsuario, AgregarUbicacionActual, AgregarUbicacionTrabajo, confirmarEmail, ConfirmarRecuperarContrasenia, detalleUsuario, loginUsuario, ObtenerPublicId, obtenerUbicacion, obtenerUbicacionTrabajo, Perfil, RecuperarContrasenia, registroUsuario, SubidaFoto, verificarFoto, verificarUbicacionActual, verificarUbicacionTrabajo } from "../controllers/ControladorUsuario.js";
import verificarAutenticacion from "../middleware/autenticacion.js";
import { listarOfertas } from "../controllers/controladorOfertas.js";
import { validacionActualizarPassUsuario, validacionActualizarUsuario, validacionRecuperarPassUsuario, validacionRegistroUsuario } from "../validation/validationUsuario.js";

const routeUsuario = Router()

routeUsuario.post('/registroUser', validacionRegistroUsuario() ,registroUsuario)
routeUsuario.get('/confirmarUser/:token', confirmarEmail)
routeUsuario.post('/loginUser', loginUsuario)
routeUsuario.post('/recuperarPassUser', RecuperarContrasenia)
routeUsuario.post('/restablecerPassUser/:token', validacionRecuperarPassUsuario(), ConfirmarRecuperarContrasenia)

//privadas
routeUsuario.get('/perfilUser', verificarAutenticacion, Perfil)
routeUsuario.put('/actualizarPerfilUser', verificarAutenticacion, validacionActualizarUsuario() ,ActualizarPerfilUsuario)
routeUsuario.put('/actualizarPassUser', verificarAutenticacion, validacionActualizarPassUsuario() ,ActualizarContraseniaUsuario)
routeUsuario.get('/detalleUser', verificarAutenticacion, detalleUsuario)
routeUsuario.get('/listarOfertas', verificarAutenticacion, listarOfertas)
routeUsuario.post('/guardar-ubicacion-user', verificarAutenticacion, AgregarUbicacionActual)
routeUsuario.post('/guardar-ubicacion-trabajo', verificarAutenticacion, AgregarUbicacionTrabajo)
routeUsuario.post('/fotoUser', verificarAutenticacion, SubidaFoto)
routeUsuario.get('/publicIdUser/:id', verificarAutenticacion, ObtenerPublicId)
routeUsuario.get('/verFotoUser', verificarAutenticacion, verificarFoto)
routeUsuario.get('/verUbiActualUser', verificarAutenticacion, verificarUbicacionActual)
routeUsuario.get('/verUbiTrabajoUser', verificarAutenticacion, verificarUbicacionTrabajo)
routeUsuario.get('/ubiUser', verificarAutenticacion, obtenerUbicacion)
routeUsuario.get('/ubiUserTra', verificarAutenticacion, obtenerUbicacionTrabajo)

export default routeUsuario