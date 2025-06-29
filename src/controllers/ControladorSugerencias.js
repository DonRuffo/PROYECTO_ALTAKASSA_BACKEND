import ModeloSugerencias from "../modules/ModeloSugerencias.js"


const EnviarComentarios = async (req, res) => {
    const { email } = req.body
    if (Object.values(req.body).includes('')) return res.status(404).json({ msg: 'Por favor, llene todos los campos' })
    const SugerenciasBDD = await ModeloSugerencias.findOne({ email })
    if (SugerenciasBDD) {
        Object.keys(req.body).forEach((key) => {
            if (req.body[key]) {
                if (key === 'comentarios') {
                    SugerenciasBDD[key].push(req.body[key])
                }else{
                  SugerenciasBDD[key] = req.body[key]  
                }
                
            }
        })
        await SugerenciasBDD.save()
    } else {
        const comentario = new ModeloSugerencias(req.body)
        await comentario.save()
    }
    res.status(200).json({msg:'Comentario enviado'})
}

export { EnviarComentarios }