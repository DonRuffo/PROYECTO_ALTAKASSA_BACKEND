import { Router } from "express";
import { actualizarTrabajo, agendarTrabajo, crearTrabajo, eliminarTrabajo, obtenerTrabajo, obtenerTrabajosDeUnProveedor, obtenerTrabajosPorCliente, obtenerTrabajosPorProveedor, rechazarTrabajo } from "../controllers/controladorTrabajos.js";
import verificarAutenticacion from "../middleware/autenticacion.js";
import { validacionActualizarTrabajo, validacionCrearTrabajo } from "../validation/validationTrabajos.js";

const routerTrabajos = Router()

routerTrabajos.post('/crearTrabajo', verificarAutenticacion, validacionCrearTrabajo(), crearTrabajo)
routerTrabajos.get('/verTrabajo/:id', verificarAutenticacion, obtenerTrabajo)
routerTrabajos.get('/trabajos-agendados/:id', verificarAutenticacion, obtenerTrabajosDeUnProveedor)
routerTrabajos.put('/actualizarTrabajo/:id', verificarAutenticacion, validacionActualizarTrabajo(), actualizarTrabajo)
routerTrabajos.delete('/eliminarTrabajo/:id', verificarAutenticacion, eliminarTrabajo)
routerTrabajos.get('/trabajos-proveedor', verificarAutenticacion, obtenerTrabajosPorProveedor)
routerTrabajos.get('/trabajos-cliente', verificarAutenticacion, obtenerTrabajosPorCliente)
routerTrabajos.put('/agendarTrabajo/:id',verificarAutenticacion, agendarTrabajo)
routerTrabajos.put('/rechazarTrabajo/:id',verificarAutenticacion, rechazarTrabajo)

//ojala valga

export default routerTrabajos