const express=require("express")
const mongoose=require("mongoose")
const bookRoutes = require("./routes/book.routes")
const {config}=require("dotenv")
config()
const app = express()
//app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //parsear solicitudes json
// app.use(bodyParser.json())

//conexion a DB
mongoose.connect(process.env.MONGO_URL, {dbName:process.env.MONGO_DB_NAME})
const db=mongoose.connection



app.use("/books", bookRoutes)

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`servidor iniciado en http://localhost:${port}`)
})

