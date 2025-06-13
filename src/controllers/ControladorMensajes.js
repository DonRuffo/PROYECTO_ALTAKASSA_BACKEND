import Conversacion from "../modules/ModeloMensajes.js";

const guardarMensaje = async (req, res) => {
    try {
        const emisor = req.usuarioBDD._id;
        const { receptor, mensaje } = req.body;
        if (!receptor || !mensaje) {
            return res.status(400).json({ msg: "Faltan datos" });
        }

        let conversacion = await Conversacion.findOne({
            participantes: { $all: [emisor, receptor], $size: 2 }
        });

        const nuevoMensaje = { emisor, mensaje };

        if (conversacion) {
            conversacion.mensajes.push(nuevoMensaje);
            await conversacion.save();
        } else {
            conversacion = await Conversacion.create({
                participantes: [emisor, receptor],
                mensajes: [nuevoMensaje]
            });
        }

        res.status(201).json(conversacion);
    } catch (error) {
        res.status(500).json({ msg: "Error al guardar el mensaje", error });
    }
};

const obtenerMensajes = async (req, res) => {
    const usuarioID = req.usuarioBDD._id;
    const io = req.app.get('io')
    try {
        if (!usuarioID) {
            return res.status(400).json({ msg: "Falta ID del usuario" });
        }

        const conversacion = await Conversacion.find({
            participantes: usuarioID
        })
        .populate("participantes", "nombre apellido")
        .populate("mensajes.emisor", "nombre apellido");

        if (!conversacion) {
            io.emit('Conversaciones', { mensajes: [] });
            return res.json({ mensajes: [] });
        }

        io.emit('Conversaciones', { conversacion });
        res.json({ conversacion });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los mensajes", error });
    }
};


export { 
    guardarMensaje, 
    obtenerMensajes 
};