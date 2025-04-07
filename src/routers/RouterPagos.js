import { Router } from "express";
import { cancel, pagoTarjeta, success } from "../controllers/controladorPagos.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

const routerPagos = Router()

routerPagos.post('/crearPago/:id',verificarAutenticacion, pagoTarjeta)
routerPagos.get('/success',success)
routerPagos.get('/cancel',cancel)

export default routerPagos
