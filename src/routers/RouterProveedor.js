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
import { validacionActualizarPassProveedor, validacionActualizarProveedor, validacionRecuperarPassProveedor, validacionRegistroProveedor } from "../validation/validationProveedores.js";

const routeProveedor = Router()

routeProveedor.post('/registroProveedor', validacionRegistroProveedor(), registroProve)
routeProveedor.get('/confirmarProveedor/:token',confirmarEmail)
routeProveedor.post('/loginProveedor', loginProve)
routeProveedor.post('/recuperar-contrasenia-prov', RecuperarContrasenia)
routeProveedor.post('/restablecer-contrasenia-prov/:token', validacionRecuperarPassProveedor(), ConfirmarRecuperarContrasenia)

//privadas
routeProveedor.get('/perfil-proveedor', verificarAutenticacion, Perfil)
routeProveedor.put('/actualizar-perfilProveedor', verificarAutenticacion, validacionActualizarProveedor(), ActualizarPerfilProveedor)
routeProveedor.put('/actualizar-contraseniaProveedor', verificarAutenticacion, validacionActualizarPassProveedor(), ActualizarContraseniaProve)
routeProveedor.get('/detalleProveedor/:id', verificarAutenticacion, detalleProveedor)




export default routeProveedor