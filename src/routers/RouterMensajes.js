import { Router } from "express";
import { guardarMensaje, obtenerMensajes } from "../controllers/ControladorMensajes.js";
import verificarAutenticacion from "../middleware/autenticacion.js";

const routerChat = Router();

routerChat.post("/envioMensaje", verificarAutenticacion, guardarMensaje);
routerChat.get("/mensajes", verificarAutenticacion, obtenerMensajes);

export default routerChat;