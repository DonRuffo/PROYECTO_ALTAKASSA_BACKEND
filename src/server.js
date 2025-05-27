import express from 'express'
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import RouterAdmin from './routers/RouterAdmin.js';
import routerOfertas from './routers/RouterOfertas.js';
import routerTrabajos from './routers/RouterTrabajos.js';
import routerPagos from './routers/RouterPagos.js';
import routeCloud from './routers/RouterCloud.js';
import routeSug from './routers/RouterSugerencias.js';
import routeUsuario from './routers/RouteUsuario.js';
import helmet from 'helmet';
import sanitize from 'mongo-sanitize'
import rateLimit from 'express-rate-limit'
const app = express()

dotenv.config()

app.use(express.json())

app.use(rateLimit({
  windowMs:15*60*1000,
  max:100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas solicitudes. Inténtalo más tarde.'
}))

const corsOptions = {
    origin: ['http://localhost:5173', 'https://altakassa.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'method', 'Origin', 'Accept'],
};
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(morgan('dev'))

//seguridad
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc : ["'self'", 'https://altakassa1503003.up.railway.app']
    }
}))
app.use(helmet.frameguard({action:'deny'})) 
app.use(helmet.hidePoweredBy())
app.use(
  helmet.hsts({
    maxAge: 60 * 60 * 24 * 365 * 2, // 2 años
    includeSubDomains: true,
    preload: true
  })
);
app.use(helmet.originAgentCluster());
app.disable('x-powered-by'); 

//sanitizar
app.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
});


app.set('port', process.env.PORT || 3000)

app.use('/api', RouterAdmin)
app.use('/api', routerOfertas)
app.use('/api', routerTrabajos)
app.use('/api', routerPagos)
app.use('/api', routeCloud)
app.use('/api', routeSug)
app.use('/api', routeUsuario)

app.get('/', (req, res) => { res.send("Servidor levantado") })


app.use((req, res) => res.status(400).send("Endpoint no encontrado"))

export default app