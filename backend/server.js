import express from 'express'
import cors from 'cors'
import { noteRoutes } from './routes/noteRoutes.js'

const PORT = 3000
const app = express()

app.use(express.json())
app.use(cors('*'))
app.use('/api/notes',noteRoutes)


app.listen(PORT , () =>{
    console.log(`Server is running at http://localhost:${PORT}`)
})