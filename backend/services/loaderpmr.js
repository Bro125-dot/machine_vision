import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const file= 'syslogpmr18-05.txt'

function loadLogFile(filename){
    const ROOT = path.join(__dirname,'..','data' , filename)
    const logs = fs.readFileSync(ROOT , 'utf-8') 
    const righe = logs.split('\n')
    const logs_filtrati = righe.filter((riga) => {
        if (riga !== '') return riga
    })
    return logs_filtrati
}

console.log(loadLogFile(file))

export default loadLogFile