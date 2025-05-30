import jwt from 'jsonwebtoken'
import Usuario from '../modules/ModuloUsuario.js'

const verificarAutenticacion = async (req, res, next) => {

    if (!req.headers.authorization) return res.status(404).json({ msg: "Lo sentimos, debes proprocionar un token" })
    const { authorization } = req.headers
    try {
        const { id, rol } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET)
        if (rol === "administrador") {
            req.AdminBDD = await Usuario.findById(id).lean().select("-contrasenia")
            next()
        }
        else if (rol === "usuario") {
            req.usuarioBDD = await Usuario.findById(id).lean().select("-contrasenia")
            next()
        }
        else {
            const e = new Error("No tienes permisos para acceder a esta ruta")
            return res.status(404).json({ msg: e.message })
        }

    } catch (error) {
        const e = new Error("Formato del token no válido")
        return res.status(404).json({ msg: e.message })
    }
}

export default verificarAutenticacion