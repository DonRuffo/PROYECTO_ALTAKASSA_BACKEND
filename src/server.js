import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import RouterAdmin from './routers/RouterAdmin.js';
import routeProveedor from './routers/RouterProveedor.js';
import routerPaginas from './routers/RouterPaginas.js';
import routerEstilos from './routers/RouterEstilos.js';
import routerImagenes from './routers/RouterImagenes.js';

dotenv.config()
const app = express()
app.use(express.json())

app.use(cors())

app.use(morgan('dev'))

app.set('port', process.env.PORT || 3000)

app.use('/api',RouterAdmin)
app.use('/api', routeProveedor)
app.use('/', routerPaginas)
app.use('/Estilos', routerEstilos)
app.use('/Imagenes', routerImagenes)

app.use((req,res)=> res.status(400).send("Endpoint no encontrado"))

export default app