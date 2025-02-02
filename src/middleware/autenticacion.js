import jwt from 'jsonwebtoken'
import Administrador from '../modules/ModeloAdmin.js'
import Cliente from '../modules/ModeloCliente.js'
import Proveedor from '../modules/ModeloProveedor.js'

const verificarAutenticacion = async (req,res,next)=>{

if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"})    
    const {authorization} = req.headers
    try {
        const {id,rol} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
        if (rol==="administrador"){
            req.administradorBDD = await Administrador.findById(id).lean().select("-password")
            next()
        }
        else if(rol==="cliente"){
            req.clienteBDD = await Cliente.findById(id).lean().select("-password")
            next()
        }
        else if(rol==="proveedor"){
            req.proveedorBDD = await Proveedor.findById(id).lean().select("-password")
            next()
        }
        else{
            const e = new Error("No tienes permisos para acceder a esta ruta")
            return res.status(404).json({msg:e.message})
        }

    } catch (error) {
        const e = new Error("Formato del token no válido")
        return res.status(404).json({msg:e.message})
    }
}

export default verificarAutenticacion