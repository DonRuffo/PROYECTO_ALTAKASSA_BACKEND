import { Router } from "express";
import { actualizarTrabajo, crearTrabajo, eliminarTrabajo, obtenerTrabajo } from "../controllers/controladorTrabajos.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

const routerTrabajos = Router()

routerTrabajos.post('/crearTrabajo', verificarAutenticacion, crearTrabajo)
routerTrabajos.get('/verTrabajo/:id', verificarAutenticacion, obtenerTrabajo)
routerTrabajos.put('/actualizarTrabajo/:id', verificarAutenticacion, actualizarTrabajo)
routerTrabajos.delete('/eliminarTrabajo/:id', verificarAutenticacion, eliminarTrabajo)


export default routerTrabajos