import { Router } from "express";
import verificarAutenticacion from "../middleware/autenticacion.js";
import { actualizarOferta, crearOferta, eliminarOferta, listarOfertas, misOfertas, verOferta } from "../controllers/controladorOfertas.js";


const routerOfertas = Router();

routerOfertas.post("/crearOferta", verificarAutenticacion, crearOferta)
routerOfertas.get("/verOferta/:id", verificarAutenticacion, verOferta)
routerOfertas.put("/actualizarOferta/:id", verificarAutenticacion, actualizarOferta)
routerOfertas.delete("/eliminarOferta/:id", verificarAutenticacion, eliminarOferta)
routerOfertas.get("/listarOfertas", verificarAutenticacion, listarOfertas)
routerOfertas.get("/misOfertas", verificarAutenticacion, misOfertas)


export default routerOfertas