import express from "express"
import "dotenv/config"
import connectDB from "./config/db.js"
import morgan from "morgan"
import librosRouter from "./routers/libros.js"
import usersRouter from "./routers/users.js"
import cors from 'cors';



const server = express()
const host = process.env.HOST
const port = process.env.PORT 


connectDB()

//midleware
server.use(cors())
server.use(express.json())
server.use(morgan("dev"))
server.use("/libros", librosRouter)
server.use("/users", usersRouter)



server.get("/", (req, res)=>{
res.send(`libros en ${host}:${port}/libros
   usuarios en ${host}:${port}/users
  `)
})




server.listen(port, ()=>{
    console.log(`server is running at ${host} in port ${port}`);
})