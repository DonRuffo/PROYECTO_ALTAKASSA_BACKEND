import { Router } from "express";
import { cancel, pagoPlan, success } from "../controllers/controladorPagos.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

const routerPagos = Router()

routerPagos.post('/pagoPlan/:id',verificarAutenticacion, pagoPlan)
routerPagos.get('/success', verificarAutenticacion ,success)
routerPagos.get('/cancel', verificarAutenticacion ,cancel)

export default routerPagos
