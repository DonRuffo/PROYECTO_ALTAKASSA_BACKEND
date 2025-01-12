import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import RouterAdmin from './routers/RouterAdmin.js';
import routeProveedor from './routers/RouterProveedor.js';

dotenv.config()
const app = express()
app.use(express.json())


app.use(cors());


app.use(morgan('dev'))

app.set('port', process.env.PORT || 3000)

app.use('/api',RouterAdmin)
app.use('/api', routeProveedor)
app.get('/', (req, res)=>{res.send("Servidor levantado")})


app.use((req,res)=> res.status(400).send("Endpoint no encontrado"))

export default app