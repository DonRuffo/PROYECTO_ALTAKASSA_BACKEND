import { Router } from "express";
import verificarAutenticacion from "../middleware/autenticacion.js";
import { CrearCategoria, EliminarCategoría, ObtenerCategorias } from "../controllers/ControladorCategorias.js";

const routeCategorias = Router()

routeCategorias.post('/nuevaCategoria', verificarAutenticacion, CrearCategoria)
routeCategorias.delete('/eliminarCategoria/:id', verificarAutenticacion, EliminarCategoría)
routeCategorias.get('/listaCategorias', verificarAutenticacion, ObtenerCategorias)

export default routeCategorias