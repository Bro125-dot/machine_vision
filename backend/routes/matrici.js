import express from 'express'
import { parseLogLines,extractMode,extractStats } from '../parsers/matriceparser.js'
import loadLogFile from '../services/loaderpmr.js'


const file= 'syslogpmr18-05.txt'

const router = express.Router()
const data = loadLogFile(file)


router.get("/matrici/:robot/:matrice",(req,res) =>{
    const {robot , matrice} = req.params
    if (matrice.includes(robot)){
        res.json({
            modes : extractMode(parseLogLines(data,matrice)),
            counts : extractStats(parseLogLines(data,matrice))
        })
    }
    else{
        res.status(400).json({ error: 'Robot non corrisponde alla matrice' })
    }
})

export default router