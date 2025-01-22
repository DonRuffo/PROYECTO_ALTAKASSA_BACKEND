import { Router } from "express";
import { RecuperarContrasenia, 
        ConfirmarRecuperarContrasenia,
        registroProve,
        confirmarEmail,
        loginProve,
        ActualizarPerfilProveedor,
        ActualizarContraseniaProve,
        Perfil} from "../controllers/controladorProveedor.js";

const routeProveedor = Router()

routeProveedor.post('/registroProveedor',registroProve)
routeProveedor.get('/confirmarProveedor/:token',confirmarEmail)
routeProveedor.post('/loginProveedor', loginProve)
routeProveedor.post('/recuperar-contrasenia-prov', RecuperarContrasenia)
routeProveedor.post('/restablecer-contrasenia-prov/:token', ConfirmarRecuperarContrasenia)

//privadas
routeProveedor.get('/perfil-proveedor', Perfil)
routeProveedor.post('/actualizar-perfilProveedor', ActualizarPerfilProveedor)
routeProveedor.post('/actualizar-contraseniaProveedor', ActualizarContraseniaProve)




export default routeProveedor