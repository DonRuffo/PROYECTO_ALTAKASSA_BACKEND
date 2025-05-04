import cron from 'node-cron'
import ModeloTrabajos from '../modules/ModeloTrabajos'


cron.schedule('*/10 * * * *', async () =>{
    const ahora = new Date()

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