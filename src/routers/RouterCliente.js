import { Router } from "express";
import { confirmarEmail, loginCliente, RecuperarContrasenia, registroCliente, 
ConfirmarRecuperarContrasenia, Perfil, ActualizarPerfilCliente, ActualizarContraseniaCliente } from "../controllers/controladorCliente.js";


const routeCliente = Router()

routeCliente.post('/registroCliente',registroCliente)
routeCliente.get('/confirmarCliente/:token',confirmarEmail)
routeCliente.post('/loginCliente', loginCliente)
routeCliente.post('/recuperarPasswordCliente', RecuperarContrasenia)
routeCliente.post('/restablecerPasswordCliente/:token', ConfirmarRecuperarContrasenia)

//privadas
routeCliente.get('/perfilCliente', Perfil)
routeCliente.post('/actualizarPerfilCliente', ActualizarPerfilCliente)
routeCliente.post('/actualizarPasswordCliente', ActualizarContraseniaCliente)




export default routeCliente