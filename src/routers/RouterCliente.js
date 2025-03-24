import { Router } from "express";
import { confirmarEmail, loginCliente, RecuperarContrasenia, registroCliente, 
ConfirmarRecuperarContrasenia, Perfil, ActualizarPerfilCliente, ActualizarContraseniaCliente, 
detalleCliente,
AgregarUbicacion,
VerificarUbicacion,
ObtenerUbicacion} from "../controllers/controladorCliente.js";
import verificarAutenticacion from "../middleware/autenticacion.js";
import {validacionRegistroCliente, validacionRecuperarPassCliente, validacionActualizarCliente, validacionActualizarPassCliente } from "../validation/validationCliente.js";
import { listarOfertas } from "../controllers/controladorOfertas.js";


const routeCliente = Router()

routeCliente.post('/registroCliente', validacionRegistroCliente(), registroCliente)
routeCliente.get('/confirmarCliente/:token',confirmarEmail)
routeCliente.post('/loginCliente', loginCliente)
routeCliente.post('/recuperarPasswordCliente', RecuperarContrasenia)
routeCliente.post('/restablecerPasswordCliente/:token', validacionRecuperarPassCliente(), ConfirmarRecuperarContrasenia)

//privadas
routeCliente.get('/perfilCliente', verificarAutenticacion, Perfil)
routeCliente.put('/actualizarPerfilCliente', verificarAutenticacion, validacionActualizarCliente(), ActualizarPerfilCliente)
routeCliente.put('/actualizarPasswordCliente', verificarAutenticacion, validacionActualizarPassCliente(), ActualizarContraseniaCliente)
routeCliente.get('/detalleCliente/:id', verificarAutenticacion, detalleCliente)
routeCliente.get('/listarOfertas', verificarAutenticacion, listarOfertas)
routeCliente.get('/guardar-ubicacion-cli', verificarAutenticacion, AgregarUbicacion)
routeCliente.get('/ubicacion-cli', verificarAutenticacion, VerificarUbicacion)
routeCliente.get('/obtenerUbicacion-cli', verificarAutenticacion, ObtenerUbicacion)

export default routeCliente