import ModeloTrabajos from "../modules/ModeloTrabajos.js";
import mongoose from "mongoose";
import Ofertas from '../modules/ModeloOfertas.js'
import Trabajos from '../modules/ModeloTrabajos.js'
import ModuloUsuario from "../modules/ModuloUsuario.js";
import { DateTime } from "luxon";
import ModeloOfertas from "../modules/ModeloOfertas.js";

const crearTrabajo = async (req, res) => {
    try {
        const { fecha, hasta, desde } = req.body
        const oferta = await Ofertas.findById(req.body.oferta)
        const io = req.app.get('io')

        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debe seleccionar todos los campos" })
        if (!oferta) return res.status(404).json({ msg: "Oferta no encontrada" })
        const trabajo = new Trabajos(req.body)

        const fechaDesde = DateTime.fromISO(`${fecha}T${desde}`, { zone: 'America/Guayaquil' }).toUTC().toJSDate()
        const fechaHasta = DateTime.fromISO(`${fecha}T${hasta}`, { zone: 'America/Guayaquil' }).toUTC().toJSDate()

        trabajo.cliente = req.usuarioBDD._id
        trabajo.proveedor = oferta.proveedor
        trabajo.oferta = oferta._id
        trabajo.desde = fechaDesde
        trabajo.hasta = fechaHasta
        await trabajo.save()

        const trabajoActual = await ModeloTrabajos.findById(trabajo._id)
            .populate('cliente', 'nombre apellido email f_perfil')
            .populate('proveedor', 'nombre apellido email f_perfil')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')

        io.emit('Nueva-solicitud', { trabajoActual })
        res.status(200).json({ msg: "Trabajo creado con exito" })
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

const obtenerTrabajosDeUnProveedor = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Trabajo no encontrado" })
        const trabajo = await ModeloTrabajos.find({ proveedor: id })
            .populate('cliente', 'nombre apellido email')
            .populate('proveedor', 'nombre apellido email')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')
        if (!trabajo) return res.status(404).json({ msg: "Trabajos no encontrado" })
        res.status(200).json(trabajo)

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al obtener el trabajo" })
    }
}

const obtenerTrabajosPorProveedor = async (req, res) => {
    try {
        const trabajos = await ModeloTrabajos.find({ proveedor: req.usuarioBDD._id })
            .populate('cliente', 'nombre apellido email f_perfil')
            .populate('proveedor', 'nombre apellido email f_perfil')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')
        if (!trabajos) return res.status(404).json({ msg: "No tienes solicitudes de trabajo" })


        res.status(200).json(trabajos)

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al obtener los trabajos" })
    }
}

const obtenerTrabajosPorCliente = async (req, res) => {
    try {
        const trabajos = await ModeloTrabajos.find({ cliente: req.usuarioBDD._id })
            .populate('cliente', 'nombre apellido email f_perfil')
            .populate('proveedor', 'nombre apellido email f_perfil')
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
    const io = req.app.get('io')
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Trabajo no encontrado" })
        const trabajo = await ModeloTrabajos.findById(id)
            .populate('cliente', 'nombre apellido email f_perfil')
            .populate('proveedor', 'nombre apellido email f_perfil')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')
        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" })
        trabajo.oferta = req.body.oferta || trabajo.oferta
        trabajo.fecha = req.body.fecha || trabajo.fecha
        trabajo.servicio = req.body.servicio || trabajo.servicio
        trabajo.tipo = req.body.tipo || trabajo.tipo
        trabajo.desde = req.body.desde || trabajo.desde
        trabajo.hasta = req.body.hasta || trabajo.hasta
        trabajo.precioTotal = req.body.precioTotal || trabajo.precioTotal
        trabajo.calificacionCliente = req.body.calificacionCliente || trabajo.calificacionCliente
        trabajo.calificacionProveedor = req.body.calificacionProveedor || trabajo.calificacionProveedor
        const trabajoActualizado = await trabajo.save()

        io.emit('Trabajo-actualizado', { id, trabajoActualizado })
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
    const io = req.app.get('io')
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Trabajo no encontrado" })
        const trabajo = await ModeloTrabajos.findById(id)
            .populate('cliente', 'nombre apellido email f_perfil')
            .populate('proveedor', 'nombre apellido email f_perfil')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')
        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" })

        io.emit('Trabajo-eliminado', { id, trabajo })
        await trabajo.deleteOne()
        res.status(200).json({ msg: "Trabajo eliminado correctamente" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al eliminar el trabajo" })
    }
}

const agendarTrabajo = async (req, res) => {
    const { id } = req.params;
    const usuario = await ModuloUsuario.findById(req.usuarioBDD._id)
    if (usuario.monedasTrabajos === 0) {
        return res.status(403).json({ msg: "Ya no tienes créditos, actualiza tu plan" })
    }
    try {
        const io = req.app.get('io')
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Trabajo no encontrado" });
        const trabajo = await ModeloTrabajos.findById(id)
            .populate('cliente', 'nombre apellido email f_perfil')
            .populate('proveedor', 'nombre apellido email f_perfil')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')
        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" });
        if (trabajo.status !== "En espera") return res.status(400).json({ msg: "El trabajo ya no puede ser agendar o ya fue agendado" });

        trabajo.status = "Agendado";
        usuario.monedasTrabajos -= 1;
        const trabajoActualizado = await trabajo.save();
        await usuario.save()

        const ofertaResp = await ModeloOfertas.findById(trabajoActualizado.oferta._id)
            .populate('proveedor', 'nombre apellido monedasTrabajos f_perfil')

        io.emit('Trabajo-agendado', { id, trabajoActualizado })
        io.emit('Remover-oferta', { ofertaResp })

        res.status(200).json({
            msg: "Has aceptado la solicitud",
            trabajoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al actualizar el estado del trabajo" });
    }
}

const rechazarTrabajo = async (req, res) => {
    const { id } = req.params;
    try {
        const io = req.app.get('io')
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Trabajo no encontrado" });
        const trabajo = await ModeloTrabajos.findById(id)
            .populate('cliente', 'nombre apellido email f_perfil')
            .populate('proveedor', 'nombre apellido email f_perfil')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')
        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" });
        if (trabajo.status === "Completado" || trabajo.status === "Rechazado") return res.status(400).json({ msg: "El trabajo ya no puede ser rechazado" });

        trabajo.status = "Rechazado";
        const trabajoActualizado = await trabajo.save();
        io.emit('Trabajo-rechazado', { id, trabajoActualizado })
        res.status(200).json({
            msg: "Has rechazado la solicitud",
            trabajoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al actualizar el estado del trabajo" });
    }
}

const cancelarTrabajo = async (req, res) => {
    const { id } = req.params;
    const proveedor = req.query.proveedor
    try {
        const io = req.app.get('io')
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Trabajo no encontrado" });
        if (!mongoose.Types.ObjectId.isValid(proveedor)) return res.status(404).json({ msg: "Proveedor no encontrado" });
        const trabajo = await ModeloTrabajos.findById(id)
            .populate('cliente', 'nombre apellido f_perfil')
            .populate('proveedor', 'nombre apellido f_perfil')
            .populate('oferta', 'servicio precioPorDia precioPorHora descripcion')

        const usuario = await ModuloUsuario.findById(proveedor)

        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" });
        trabajo.status = "Cancelado";
        usuario.monedasTrabajos += 1;
        const trabajoActualizado = await trabajo.save();
        await usuario.save()

        const ofertaResp = await ModeloOfertas.find({proveedor: proveedor})
            .populate('proveedor', 'nombre apellido monedasTrabajos promedioProveedor f_perfil')
        io.emit('Trabajo-cancelado', { id, trabajoActualizado })
        io.emit('Restablecer-oferta', { ofertaResp })
        res.status(200).json({
            msg: "Has cancelado el trabajo",
            trabajoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al actualizar el estado del trabajo" });
    }
}

const calificarProveedor = async (req, res) => {
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Calificar por favor" })
    const { calificacionProveedor } = req.body
    const { id } = req.params;
    const io = req.app.get('io')

    try {
        if (!id) return res.status(400).json({ msg: "ID del proveedor requerido" })

        const trabajo = await ModeloTrabajos.findById(id)
        .populate('proveedor', 'nombre apellido email f_perfil calificacionesProveedor promedioProveedor')
        .populate('cliente', 'nombre apellido email f_perfil calificacionesCliente promedioCliente')
        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" })

        const usuario = await ModuloUsuario.findById(trabajo.proveedor._id)
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" })

        const calificaciones = usuario.calificacionesProveedor.length
        if(calificaciones === 0) {
            usuario.promedioProveedor = calificacionProveedor
            usuario.calificacionesProveedor.push(calificacionProveedor)
        } else {
            const sumaCalificaciones = usuario.calificacionesProveedor.reduce((a, b) => a + b, 0)
            const nuevoPromedio = (sumaCalificaciones + calificacionProveedor) / (calificaciones + 1)
            usuario.promedioProveedor = nuevoPromedio
            usuario.calificacionesProveedor.push(calificacionProveedor)
        }
        trabajo.calificacionProveedor = calificacionProveedor
        trabajo.status = "Completado"

        io.emit('Trabajo-completado', { id, trabajo })
        await trabajo.save()
        await usuario.save()
        res.status(200).json({ msg: "Calificación enviada" })
    } catch (error) {
        res.status(500).json({ msg: "Error al calificar al proveedor", error })
    }

}

const calificarCliente = async (req, res) => {
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Calificar por favor" })
    const { calificacionCliente } = req.body
    const { id } = req.params;
    const io = req.app.get('io')
    

    try {
        if (!id) return res.status(400).json({ msg: "ID del cliente requerido" })

        const trabajo = await ModeloTrabajos.findById(id)
        .populate('cliente', 'nombre apellido f_perfil calificacionesCliente promedioCliente')
        .populate('proveedor', 'nombre apellido f_perfil calificacionesProveedor promedioProveedor')
        if (!trabajo) return res.status(404).json({ msg: "Trabajo no encontrado" })

        const usuario = await ModuloUsuario.findById(trabajo.cliente._id)
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" })
        const calificaciones = usuario.calificacionesCliente.length
        if(calificaciones === 0) {
            usuario.promedioCliente = calificacionCliente
            usuario.calificacionesCliente.push(calificacionCliente)
        } else {
            const sumaCalificaciones = usuario.calificacionesCliente.reduce((a, b) => a + b, 0)
            const nuevoPromedio = (sumaCalificaciones + calificacionCliente) / (calificaciones + 1)
            usuario.promedioCliente = nuevoPromedio
            usuario.calificacionesCliente.push(calificacionCliente)
        }
        trabajo.calificacionCliente = calificacionCliente;
        trabajo.status = "Completado"
        io.emit('Trabajo-completado-prov', { id, trabajo })
        await trabajo.save()
        await usuario.save()
        res.status(200).json({ msg: "Calificación enviada" })
    } catch (error) {
        res.status(500).json({ msg: "Error al calificar al cliente", error })
    }

}


export {
    crearTrabajo,
    obtenerTrabajo,
    actualizarTrabajo,
    eliminarTrabajo,
    obtenerTrabajosPorProveedor,
    obtenerTrabajosPorCliente,
    agendarTrabajo,
    rechazarTrabajo,
    cancelarTrabajo,
    obtenerTrabajosDeUnProveedor,
    calificarProveedor,
    calificarCliente
}
