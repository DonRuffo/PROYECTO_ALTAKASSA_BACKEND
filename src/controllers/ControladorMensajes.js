import Conversacion from "../modules/ModeloMensajes.js";

const guardarMensaje = async (req, res) => {
    const io = req.app.get('io')
    try {
        const emisor = req.usuarioBDD._id;
        const { receptor, mensaje } = req.body;
        if (!receptor || !mensaje) {
            return res.status(400).json({ msg: "Faltan datos" });
        }

        let conversacion = await Conversacion.findOne({
            participantes: { $all: [emisor, receptor], $size: 2 }
        }).populate('participantes', 'nombre apellido f_perfil');

        const nuevoMensaje = { emisor, mensaje };

        if (conversacion) {
            conversacion.mensajes.push(nuevoMensaje);
            await conversacion.save();
        } else {
            conversacion = await Conversacion.create({
                participantes: [emisor, receptor],
                mensajes: [nuevoMensaje]
            })
            conversacion = await Conversacion.findById(conversacion._id).populate('participantes', 'nombre apellido f_perfil');
        }
        io.emit('Mensaje', {conversacion})

        res.status(201).json(conversacion);
    } catch (error) {
        res.status(500).json({ msg: "Error al guardar el mensaje", error });
    }
};

const obtenerMensajes = async (req, res) => {
    const usuarioID = req.usuarioBDD._id;
    try {
        if (!usuarioID) {
            return res.status(400).json({ msg: "Falta ID del usuario" });
        }

        const conversacion = await Conversacion.find({
            participantes: usuarioID
        }).populate('participantes', 'nombre apellido f_perfil');

        if (!conversacion) {
            return res.json({ mensajes: [] });
        }
        res.json({ conversacion });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los mensajes", error });
    }
};


export { 
    guardarMensaje, 
    obtenerMensajes 
};