import ModeloOfertas from "../modules/ModeloOfertas.js";
import mongoose from "mongoose";

const crearOferta = async (req, res) => {
    const {precioPorDia, precioPorHora, servicio, descripcion} = req.body;
    const usuario = await ModuloUsuario.findById(req.usuarioBDD._id);

    if (usuario.monedasOfertas === 0) {
        return res.status(403).json({ msg: "Has alcanzado el límite de ofertas gratuitas. Considera cambiar a un plan premium." });
    }

    try{
        if (Object.values(req.body).includes("")) return res. status (400).json({msg: "Lo sentimos, debe llenar todo los campos."})

        const nuevaOferta = new ModeloOfertas({
            proveedor: req.usuarioBDD._id,
            precioPorDia,
            precioPorHora,
            servicio,
            descripcion
        })

        await nuevaOferta.save()

        usuario.monedasOfertas -= 1;
        await usuario.save();

        res.status(200).json({msg: "Oferta creada correctamente.", oferta: nuevaOferta})

    }catch(error){
        console.log(error)
        res.status(500).json({msg: "Error al crear la oferta."})
    }
}

const verOferta = async(req,res)=>{
    const {id} = req.params

    try{
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg: "ID no válido."})
        const oferta = await ModeloOfertas.findById(id).populate('proveedor','nombre apellido email f_perfil ubicacionTrabajo')
        if(!oferta) return res.status(404).json({ msg: "Oferta no encontrada" })
        res.status(200).json(oferta)

    }catch (error){
        console.log(error)
        res.status(500).json({msg: "Error al ver la oferta."})
    }
}

const actualizarOferta = async (req, res) =>{
    const {id} = req.params

    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg: "ID no válido"})
        
        const oferta = await ModeloOfertas.findById(id)
        
        if (!oferta) return res.status(404).json({msg: "Oferta no encontrada"})

        if (oferta.proveedor.toString() !== req.usuarioBDD._id.toString()) return res.status(403).json({msg: "No tiene permisos para actulaizar esta oferta"})

        const { precioPorDia, precioPorHora, servicio, descripcion } = req.body
        oferta.precioPorDia = precioPorDia || oferta.precioPorDia
        oferta.precioPorHora = precioPorHora || oferta.precioPorHora
        oferta.servicio = servicio || oferta.servicio
        oferta.descripcion = descripcion || oferta.descripcion

        await oferta.save()
        res.status(200).json({msg: "Oferta actualizada correctamente", oferta})


    }catch(error){
        console.log(error)
        res.status(500).json({msg: "Error al actualizar la oferta"})
    }
}

const eliminarOferta = async (req,res) =>{
    const {id} = req.params

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg: "ID no valido"}) 
        const oferta = await ModeloOfertas.findById(id)

        if(!oferta) return res.status(404).json({msg: "Oferta no encontrada"})

        if (oferta.proveedor.toString() !== req.usuarioBDD._id.toString()) return res.status(404).json({ msg: "No tienes permisos para eliminar esta oferta" })

        await oferta.deleteOne();
        res.status(200).json({msg: 'Oferta eliminada correctamente'})

    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Error al eliminar la oferta"})
    }
}

const misOfertas = async (req,res) => {
    try {
        const ofertas = await ModeloOfertas.find({ proveedor: req.usuarioBDD._id })
            .populate('proveedor', 'nombre apellido email');
        res.status(200).json(ofertas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener las ofertas del proveedor" });
    }
}

const listarOfertas = async (req,res) => {
    try {
        const ofertas = await ModeloOfertas.find().populate('proveedor', 'nombre apellido email f_perfil');
        res.status(200).json(ofertas);
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