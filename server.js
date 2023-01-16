const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const apiProducts = require('./api/contenedor.js')
const apiMessages = require('./api/messages.js')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const products = new apiProducts('productos.txt')
const messages = new apiMessages('messages.txt')


const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

io.on('connection', async socket => {
    console.log('Cliente esperando en linea')
    io.sockets.emit('productsTable', await products.getAll())
    socket.on('newProduct', async data => {
        await products.save(data)
        io.sockets.emit('productsTable', await products.getAll())
    })
    io.sockets.emit('allMessages', await messages.getAll())

    socket.on('nuevoMsn', async data => {
        data.date = new Date().toLocaleString()
        console.log(data)
        await messages.save(data)
        io.sockets.emit('allMessages', await messages.getAll())
    })

})

