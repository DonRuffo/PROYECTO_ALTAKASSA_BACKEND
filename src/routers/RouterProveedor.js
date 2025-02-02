import { Router } from "express";
import { RecuperarContrasenia, 
        ConfirmarRecuperarContrasenia,
        registroProve,
        confirmarEmail,
        loginProve,
        ActualizarPerfilProveedor,
        ActualizarContraseniaProve,
        Perfil,
        detalleProveedor} from "../controllers/controladorProveedor.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

const routeProveedor = Router()

routeProveedor.post('/registroProveedor',registroProve)
routeProveedor.get('/confirmarProveedor/:token',confirmarEmail)
routeProveedor.post('/loginProveedor', loginProve)
routeProveedor.post('/recuperar-contrasenia-prov', RecuperarContrasenia)
routeProveedor.post('/restablecer-contrasenia-prov/:token', ConfirmarRecuperarContrasenia)

//privadas
routeProveedor.get('/perfil-proveedor', verificarAutenticacion, Perfil)
routeProveedor.post('/actualizar-perfilProveedor', verificarAutenticacion, ActualizarPerfilProveedor)
routeProveedor.post('/actualizar-contraseniaProveedor', verificarAutenticacion, ActualizarContraseniaProve)
routeProveedor.get('/detalleProveedor/:id', verificarAutenticacion, detalleProveedor)




export default routeProveedor