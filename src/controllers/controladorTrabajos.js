import ModeloTrabajos from "../modules/ModeloTrabajos.js";
import mongoose from "mongoose";
import Ofertas from '../modules/ModeloOfertas.js'
import Trabajos from '../modules/ModeloTrabajos.js'

const crearTrabajo = async (req, res) => {
    try {
        const oferta = await Ofertas.findById(req.body.oferta)
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debe seleccionar todos los campos"})
        if (!oferta) return res.status(404).json({msg: "Oferta no encontrada"})
        const trabajo = new Trabajos(req.body)
        trabajo.cliente = req.clienteBDD._id
        trabajo.proveedor = oferta.proveedor
        trabajo.oferta = oferta._id
        await trabajo.save()

        res.status(200).json({msg: "Trabajo creado con exito"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al crear el trabajo" })
    }
}

const obtenerTrabajo = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Trabajo no encontrado" })
        const trabajo = await ModeloTrabajos.findById(id)
            .populate('cliente', 'nombre apellido email')
            .populate('proveedor', 'nombre apellido email')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')
        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" })
        res.status(200).json(trabajo)

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al obtener el trabajo" })
    }
}

const obtenerTrabajosPorProveedor = async (req, res) =>{
    try {
        const trabajos = await ModeloTrabajos.find({proveedor:req.proveedorBDD._id})
            .populate('cliente', 'nombre apellido email')
            .populate('proveedor', 'nombre apellido email')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')
        if (!trabajos) return res.status(404).json({ msg: "No tienes solicitudes de trabajo" })
        res.status(200).json(trabajos)

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al obtener los trabajos" })
    }
}

const actualizarTrabajo = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Trabajo no encontrado" })
        const trabajo = await ModeloTrabajos.findById(id)
        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" })
        trabajo.status = req.body.status || trabajo.status
        trabajo.tipo = req.body.tipo || trabajo.tipo
        trabajo.desde = req.body.desde || trabajo.desde
        trabajo.hasta = req.body.hasta || trabajo.hasta
        trabajo.calificacionCliente = req.body.calificacionCliente || trabajo.calificacionCliente
        trabajo.calificacionProveedor = req.body.calificacionProveedor || trabajo.calificacionProveedor
        const trabajoActualizado = await trabajo.save()
        res.status(200).json({
            msg: "Trabajo actualizado correctamente",
            trabajoActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al actualizar el trabajo" })
    }
}

const eliminarTrabajo = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Trabajo no encontrado" })
        const trabajo = await ModeloTrabajos.findById(id)
        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" })
        await trabajo.deleteOne()
        res.status(200).json({ msg: "Trabajo eliminado correctamente" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al eliminar el trabajo" })
    }
}

export {
    crearTrabajo,
    obtenerTrabajo,
    actualizarTrabajo,
    eliminarTrabajo,
    obtenerTrabajosPorProveedor
}
