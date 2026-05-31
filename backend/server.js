import express from 'express'
import cors from 'cors'
import robotsrouter from './routes/robots.js'
import matricerouter from './routes/matrici.js'
import skidOverviewRoutes from './routes/skidsoverview.js'

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000

app.use('/', robotsrouter)
app.use('/', matricerouter)
app.use('/', skidOverviewRoutes)

app.get('/', (req, res) => {
    res.send('backend funzionante')
})

app.listen(PORT, () => {
    console.log(`Server avviato sulla porta ${PORT}`)
})