import express from 'express'
import { cmd421 ,robot_chiavi} from '../parsers/cmdparser.js'
import { Loadcmddata } from '../services/loadercmd.js'


const router = express.Router()
const data = Loadcmddata()
const gruppi = robot_chiavi(data)
const parsed = cmd421(gruppi)


router.get("/robots/:cabina/:robot",(req,res) =>{
    const {cabina , robot } = req.params
    const key = `${cabina}_${robot}`
    console.log(key)
    console.log(Object.keys(parsed))
    res.json(parsed[key] || [])
})

export default router;