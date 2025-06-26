import ModeloOfertas from "../modules/ModeloOfertas.js";
import mongoose from "mongoose";
import ModuloUsuario from "../modules/ModuloUsuario.js";
import ModuloCategorias from "../modules/ModuloCategorias.js";

const crearOferta = async (req, res) => {
    const { precioPorDia, precioPorHora, servicio, descripcion, servicios } = req.body;
    const usuario = await ModuloUsuario.findById(req.usuarioBDD._id)
    const io = req.app.get('io')

    if (usuario.cantidadOfertas === 0) {
        return res.status(403).json({ msg: "Has alcanzado el límite de ofertas." });
    }

    const categoria = await ModuloCategorias.findOne({nombre:servicio});
    if(!categoria) return res.status(404).json({ msg: "Categoría no encontrada." });
    try {
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debe llenar todo los campos." })

        const nuevaOferta = new ModeloOfertas({
            proveedor: req.usuarioBDD._id,
            precioPorDia,
            precioPorHora,
            servicio,
            descripcion,
            servicios
        })

        await nuevaOferta.save()
        res.status(200).json({ msg: "Oferta creada correctamente.", oferta: nuevaOferta })

        usuario.cantidadOfertas -= 1
        categoria.suscripciones += 1
        await categoria.save()
        await usuario.save()
        const ofertaPop = await ModeloOfertas.findById(nuevaOferta._id).populate('proveedor', 'nombre apellido email f_perfil monedasTrabajos promedioProveedor')
        io.emit('Nueva-Oferta', { ofertaPop })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al crear la oferta." })
    }
}

const verOferta = async (req, res) => {
    const { id } = req.params

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID no válido." })
        const oferta = await ModeloOfertas.findById(id).populate('proveedor', 'nombre apellido email f_perfil ubicacionTrabajo')
        if (!oferta) return res.status(404).json({ msg: "Oferta no encontrada" })
        res.status(200).json(oferta)

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al ver la oferta." })
    }
}

const actualizarOferta = async (req, res) => {
    const { id } = req.params
    const io = req.app.get('io')
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID no válido" })

        const ofertaActual = await ModeloOfertas.findById(id).populate('proveedor', 'nombre apellido email f_perfil monedasTrabajos promedioProveedor');

        if (!ofertaActual) return res.status(404).json({ msg: "Oferta no encontrada" })

        if (ofertaActual.proveedor._id.toString() !== req.usuarioBDD._id.toString()) return res.status(403).json({ msg: "No tiene permisos para actulaizar esta oferta" })

        const { precioPorDia, precioPorHora, servicio, descripcion, servicios } = req.body
        ofertaActual.precioPorDia = precioPorDia || ofertaActual.precioPorDia
        ofertaActual.precioPorHora = precioPorHora || ofertaActual.precioPorHora
        ofertaActual.servicio = servicio || ofertaActual.servicio
        ofertaActual.descripcion = descripcion || ofertaActual.descripcion
        ofertaActual.servicios = servicios || ofertaActual.servicios
        io.emit('Actualizar-oferta', { id, ofertaActual })
        io.emit('Actualizacion', { id, ofertaActual })
        await ofertaActual.save()
        res.status(200).json({ msg: "Oferta actualizada correctamente", ofertaActual })


    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al actualizar la oferta" })
    }
}

const eliminarOferta = async (req, res) => {
    const { id } = req.params
    const io = req.app.get('io')
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID no valido" })
        const oferta = await ModeloOfertas.findById(id).populate('proveedor', 'nombre apellido email f_perfil')
        const usuario = await ModuloUsuario.findById(req.usuarioBDD._id)

        if (!oferta) return res.status(404).json({ msg: "Oferta no encontrada" })

        if (oferta.proveedor._id.toString() !== req.usuarioBDD._id.toString()) return res.status(404).json({ msg: "No tienes permisos para eliminar esta oferta" })

        io.emit('Oferta-eliminada', { id, oferta })
        io.emit('Eliminacion', { id })
        await oferta.deleteOne();
        usuario.cantidadOfertas += 1;

        await usuario.save()
        res.status(200).json({ msg: 'Oferta eliminada correctamente' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al eliminar la oferta" })
    }
}

const misOfertas = async (req, res) => {
    try {
        const ofertas = await ModeloOfertas.find({ proveedor: req.usuarioBDD._id })
            .populate('proveedor', 'nombre apellido email');
        res.status(200).json(ofertas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener las ofertas del proveedor" });
    }
}

const listarOfertas = async (req, res) => {
    try {
        const ofertas = await ModeloOfertas.find().populate('proveedor', 'nombre apellido email f_perfil monedasTrabajos calificacionProveedor promedioProveedor');
        const ofertasFiltradas = ofertas.filter((of) => of.proveedor.monedasTrabajos !== 0)
        res.status(200).json(ofertasFiltradas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener las ofertas del proveedor" });
    }
}

export {
    crearOferta,
    verOferta,
    actualizarOferta,
    eliminarOferta,
    misOfertas,
    listarOfertas
}