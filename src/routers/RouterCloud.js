import { Router } from "express";
import verificarAutenticacion from "../middleware/autenticacion.js";
import dotenv from 'dotenv'
import { v2 as cloudinary } from "cloudinary";

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET_CLOUD
})

const routeCloud = Router()

routeCloud.get('/firmaAK', verificarAutenticacion, (req, res) => {
    const preset = req.query.preset;
    const timestamp = Math.round((new Date()).getTime() / 1000)
    const firmaCAK = cloudinary.utils.api_sign_request(
        { timestamp, upload_preset: preset },
        cloudinary.config().api_secret
    )
    res.json({
        timestamp,
        firmaCAK,
        apiKey: cloudinary.config().api_key,
        cloudName: cloudinary.config().cloud_name
    })
})

routeCloud.delete('/eliminarFotoA', verificarAutenticacion, async (req, res) => {

    try {
        const publicId = req.query.public
        if (!publicId) return res.status(404).json({ msg: "Ingresar un id" })

        const resultado = await cloudinary.uploader.destroy(publicId)

        if (resultado.result === 'ok') {
            res.status(200).json({ msg: "Imagen eliminada" })
        } else {
            res.status(404).json({ msg: "Ocurrió un error" })
        }
    } catch (error) {
        res.status(500).json({error})
    }


})
export default routeCloud