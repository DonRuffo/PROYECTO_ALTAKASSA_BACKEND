import ModeloTrabajos from "../modules/ModeloTrabajos.js";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_KEY_S)

const pagoTarjeta = async (req,res) => {
    try {
        const { id } = req.params;
        const trabajo = await ModeloTrabajos.findById(id)
        if (!trabajo) return res.status(404).json({msg:'Trabajo no encontrado'})
        
        let precioTotal = trabajo.precioTotal
        const amount = Math.round(precioTotal * 100)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: trabajo.servicio,
                        description: `${trabajo.tipo} - ${trabajo.status}`,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/api/success',
            cancel_url: 'http://localhost:3000/api/cancel',
        });

        return res.json({msg:'Pago procesado exitosamente',session})
        
    } catch (error) {
        res.status(500).json({msg:'Error al procesar el pago'});
    }
}
const success = async (req,res) => res.send("Todo bien, todo correcto y yo que me alegro")
const cancel = async (req,res) => res.send("Retroceder a la pag fantasma xd")


export {
    pagoTarjeta,
    success,
    cancel
}