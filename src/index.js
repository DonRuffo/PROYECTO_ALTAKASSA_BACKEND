import http from 'http'
import { Server } from 'socket.io'
import app from "./server.js";
import connection from "./database.js";
import './middleware/cronJobs.js'
import { guardarMensaje } from "./controllers/ControladorMensajes.js";

connection()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://altakassa.vercel.app'],
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
  console.log('Cliente conectado: ', socket.id);
  
});

app.set('io', io)

server.listen(app.get('port'), () => {
    console.log(`Servidor levantado en puerto ${app.get('port')}`)
})