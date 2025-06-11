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
    try {
        const { usuario1, usuario2 } = req.query;
        if (!usuario1 || !usuario2) {
            return res.status(400).json({ msg: "Faltan usuarios" });
        }

        const conversacion = await Conversacion.findOne({
            participantes: { $all: [usuario1, usuario2], $size: 2 }
        }).populate("mensajes.emisor", "nombre email");

        if (!conversacion) {
            return res.json({ mensajes: [] });
        }

        res.json({ mensajes: conversacion.mensajes });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los mensajes", error });
    }
};

export { 
    guardarMensaje, 
    obtenerMensajes 
};