import ModeloPlanes from "../modules/ModeloPlanes.js";
import ModeloUsuario from "../modules/ModuloUsuario.js";
import mongoose from "mongoose";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_KEY_S)

const pagoPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await ModeloPlanes.findById(id);
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Plan no encontrado" })
        
        const usuario = await ModeloUsuario.findById(req.usuarioBDD._id)
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ msg: "Usuario no encontrado" })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: plan.nombre,
                        description: plan.descripcion,
                    },
                    unit_amount: plan.precio * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.URL_FRONTEND}/success/?_id=${usuario._id}`,
            cancel_url: `${process.env.URL_FRONTEND}/cancel`
        });

        return res.json({ msg: 'Pago procesado, redirigiendo...', session })

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al procesar el pago' });
    }
}
const success = async (req, res) => {
    try {
        const usuario = await ModeloUsuario.findById(req.usuarioBDD._id)
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ msg: "Usuario no encontrado" })

        usuario.monedasOfertas += 5;
        await usuario.save();
        res.send("Monedas adquiridas correctamente");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al adquirir monedas");
    }
}
const cancel = async (req, res) => res.send("Pago cancelado, por favor intente nuevamente")


export {
    pagoPlan,
    success,
    cancel
}