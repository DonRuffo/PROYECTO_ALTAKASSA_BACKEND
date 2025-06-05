import ModuloCategorias from "../modules/ModuloCategorias.js"


const CrearCategoria = async (req, res) => {

    const io = req.app.get('io')
    if (Object.values(req.body).includes('')) return res.status(404).json({ msg: "Debe llenar el campo" })

    try {
        const cat = new ModuloCategorias(req.body)
        await cat.save()

        io.emit('nuevaCategoria', {cat})
        res.status(200).json({msg:"Categoría creada"})
    } catch (error) {
        res.status(404).json({msg:error})
    }
}

const EliminarCategoría = async (req, res) =>{
    const {id} = req.params
    const io = req.app.get('io')
    
    if(!id) return res.status(404).json({msg:"No existe el ID"})
    try {
        const cat = await ModuloCategorias.findByIdAndDelete(id)
        if(!cat) return res.status(404).json({msg:"No existe la categoría"})
        io.emit('Categoria eliminada', {id})
        res.status(200).json({msg:"Categoría eliminada"})
    } catch (error) {
        res.status(404).json({msg:error})
    }
}

const ObtenerCategorias = async (req,res) =>{
    try {
        const cats = await ModuloCategorias.find()
        res.status(200).json(cats)
    } catch (error) {
        res.status(404).json({msg:error})
    }
}
export {
    CrearCategoria,
    EliminarCategoría,
    ObtenerCategorias
}