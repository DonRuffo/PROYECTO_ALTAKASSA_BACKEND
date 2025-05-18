import cron from 'node-cron'
import ModeloTrabajos from '../modules/ModeloTrabajos.js'
import {DateTime} from 'luxon'


cron.schedule('*/10 * * * *', async () =>{
    const ahora = DateTime.utc().toJSDate()

    const trabajosAgendados = await ModeloTrabajos.updateMany(
        {
            status:'Agendado',
            hasta:{ $lte:ahora}
        },
        {
            $set : {status:'Completado'}
        }
    );
    console.log(`[CRON] ${trabajosAgendados.modifiedCount} trabajos actualizados`)
})

cron.schedule('0 0 * * 1', async () =>{
    const ahora = new Date()

    const trabajosCancelados = await ModeloTrabajos.deleteMany({
        status: { $in: ['Cancelado', 'Completado'] }
    })

    console.log(`[CRON] ${trabajosCancelados.deletedCount} trabajos eliminados`)
})