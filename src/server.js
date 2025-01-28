import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import RouterAdmin from './routers/RouterAdmin.js';
import routeProveedor from './routers/RouterProveedor.js';
import routeCliente from './routers/RouterCliente.js';
const app = express()
const corsOptions = {
    origin: 'http://localhost:5173', // Reemplaza con el origen de tu aplicación frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};
app.use(cors(corsOptions));

dotenv.config()
app.use(express.json())

app.use(morgan('dev'))

app.set('port', process.env.PORT || 3000)

app.use('/api', RouterAdmin)
app.use('/api', routeProveedor)
app.use('/api',routeCliente)
app.get('/', (req, res) => { res.send("Servidor levantado") })


app.use((req, res) => res.status(400).send("Endpoint no encontrado"))

export default app