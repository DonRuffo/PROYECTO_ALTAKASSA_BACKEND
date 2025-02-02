import { Router } from "express";
import { confirmarEmail, loginCliente, RecuperarContrasenia, registroCliente, 
ConfirmarRecuperarContrasenia, Perfil, ActualizarPerfilCliente, ActualizarContraseniaCliente, 
detalleCliente} from "../controllers/controladorCliente.js";
import verificarAutenticacion from "../middleware/autenticacion.js";


const routeCliente = Router()

routeCliente.post('/registroCliente',registroCliente)
routeCliente.get('/confirmarCliente/:token',confirmarEmail)
routeCliente.post('/loginCliente', loginCliente)
routeCliente.post('/recuperarPasswordCliente', RecuperarContrasenia)
routeCliente.post('/restablecerPasswordCliente/:token', ConfirmarRecuperarContrasenia)

//privadas
routeCliente.get('/perfilCliente', verificarAutenticacion, Perfil)
routeCliente.post('/actualizarPerfilCliente', verificarAutenticacion, ActualizarPerfilCliente)
routeCliente.post('/actualizarPasswordCliente', verificarAutenticacion, ActualizarContraseniaCliente)
routeCliente.get('/detalleCliente/:id', verificarAutenticacion, detalleCliente)



export default routeCliente