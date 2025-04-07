import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import RouterAdmin from './routers/RouterAdmin.js';
import routeProveedor from './routers/RouterProveedor.js';
import routeCliente from './routers/RouterCliente.js';
import routerOfertas from './routers/RouterOfertas.js';
import routerTrabajos from './routers/RouterTrabajos.js';
import routerPagos from './routers/RouterPagos.js';
dotenv.config()
const app = express()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://altakassa.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json())

app.use(morgan('dev'))

app.set('port', process.env.PORT || 3000)

app.use('/api', RouterAdmin)
app.use('/api', routeProveedor)
app.use('/api', routeCliente)
app.use('/api', routerOfertas)
app.use('/api', routerTrabajos)
app.use('/api', routerPagos)

app.get('/', (req, res) => { res.send("Servidor levantado") })


app.use((req, res) => res.status(400).send("Endpoint no encontrado"))

export default app