import { Router } from "express";
import verificarAutenticacion from "../middleware/autenticacion.js";
import { EnviarComentarios } from "../controllers/ControladorSugerencias.js";

const routeSug = Router()

routeSug.post('/sugerencias', verificarAutenticacion, EnviarComentarios)

export default routeSug