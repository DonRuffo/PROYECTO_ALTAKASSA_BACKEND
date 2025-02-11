import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import RouterAdmin from './routers/RouterAdmin.js';
import routeProveedor from './routers/RouterProveedor.js';
import routeCliente from './routers/RouterCliente.js';
import routerOfertas from './routers/RouterOfertas.js';
import routerTrabajos from './routers/RouterTrabajos.js';

const app = express()
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:4000'], // Permitir ambos puertos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'method'],
};
app.use(cors(corsOptions));

app.use(cors(corsOptions));

dotenv.config()
app.use(express.json())

app.use(morgan('dev'))

app.set('port', process.env.PORT || 3000)

app.use('/api', RouterAdmin)
app.use('/api', routeProveedor)
app.use('/api',routeCliente)
app.use('/api', routerOfertas)
app.use('/api', routerTrabajos)

app.get('/', (req, res) => { res.send("Servidor levantado") })


app.use((req, res) => res.status(400).send("Endpoint no encontrado"))

export default app