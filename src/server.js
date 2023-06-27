import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import routerViews from "./routes/views.router.js"
import { Server } from "socket.io"

const app = express()
app.use(express.static(__dirname + "/public"))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


app.use("/", routerViews)

const expressServer = app.listen(8010, () => {
    console.log("servidor levantado");
})

const socketServer = new Server(expressServer)

const mensajes = []

socketServer.on("connection", (socket) => {

    console.log("conected " + socket.id);

    socket.on("message", (data) => {
        mensajes.push( data)
        socketServer.emit("imprimir",mensajes)
    })

    socket.on("authenticatedUser",(data) =>{
        socket.broadcast.emit("newUserAlert",data)
    })
})