import app from "./server.js";
import connection from "./database.js";
import './middleware/cronJobs.js'

connection()
app.listen(app.get('port'), () =>    {
    console.log(`Servidor levantado en puerto ${app.get('port')}`)
})