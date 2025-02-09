import { Router } from "express";
import { actualizarTrabajo, crearTrabajo, eliminarTrabajo, obtenerTrabajo, obtenerTrabajosPorProveedor } from "../controllers/controladorTrabajos.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

const routerTrabajos = Router()

routerTrabajos.post('/crearTrabajo', verificarAutenticacion, crearTrabajo)
routerTrabajos.get('/verTrabajo/:id', verificarAutenticacion, obtenerTrabajo)
routerTrabajos.put('/actualizarTrabajo/:id', verificarAutenticacion, actualizarTrabajo)
routerTrabajos.delete('/eliminarTrabajo/:id', verificarAutenticacion, eliminarTrabajo)
routerTrabajos.get('/verTrabajos', verificarAutenticacion, obtenerTrabajosPorProveedor)


export default routerTrabajos