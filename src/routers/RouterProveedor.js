import { Router } from "express";
import { RecuperarContrasenia, 
        ConfirmarRecuperarContrasenia,
        registroProve,
        confirmarEmail,
        loginProve,
        ActualizarPerfilProveedor,
        ActualizarContraseniaProve} from "../controllers/controladorProveedor.js";

const routeProveedor = Router()

routeProveedor.post('/registroProveedor',registroProve)
routeProveedor.get('/confirmarProveedor/:token',confirmarEmail)
routeProveedor.post('/loginProveedor', loginProve)
routeProveedor.post('/actualizar-perfilProveedor', ActualizarPerfilProveedor)
routeProveedor.post('/actualizar-contraseniaProveedor', ActualizarContraseniaProve)

routeProveedor.post('/recuperar-contrasenia-prov', RecuperarContrasenia)
routeProveedor.post('/restablecer-contrasenia-prov/:token', ConfirmarRecuperarContrasenia)


export default routeProveedor