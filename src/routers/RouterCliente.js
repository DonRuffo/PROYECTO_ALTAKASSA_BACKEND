import { Router } from "express";
import { confirmarEmail, loginCliente, RecuperarContrasenia, registroCliente, 
ConfirmarRecuperarContrasenia, Perfil, ActualizarPerfilCliente, ActualizarContraseniaCliente, 
detalleCliente} from "../controllers/controladorCliente.js";
import verificarAutenticacion from "../middleware/autenticacion.js";
import {validacionRegistroCliente, validacionRecuperarPassCliente, validacionActualizarCliente, validacionActualizarPassCliente } from "../validation/validationCliente.js";


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



export default routeCliente