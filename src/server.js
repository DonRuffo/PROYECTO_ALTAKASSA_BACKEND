import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import RouterAdmin from './routers/RouterAdmin.js';
import routeProveedor from './routers/RouterProveedor.js';

dotenv.config()
const app = express()
app.use(express.json())

const corsOptions = {
    origin: ['http://localhost:4000', 'https://altakassa.vercel.app/'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));


app.use(morgan('dev'))

app.set('port', process.env.PORT || 3000)

app.use('/api',RouterAdmin)
app.use('/api', routeProveedor)
app.get('/', (req, res)=>{res.send("Servidor levantado")})
app.use('/proxy', async (req, res) => {
    const url = 'https://apialtakassa1502.vercel.app' + req.url; // Redirige la solicitud
    const options = {
        method: req.method,
        headers: req.headers,
        body: req.body,
    };
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(response.status).json(data);
});


app.use((req,res)=> res.status(400).send("Endpoint no encontrado"))

export default app