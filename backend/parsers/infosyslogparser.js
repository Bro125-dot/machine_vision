import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const file = 'syslogpmr18-05.txt'


export function loadLogFile(){
    const ROOT = path.join(__dirname,'..','data', file)

    const logs = fs.readFileSync(ROOT,'utf-8')

    return logs
}

export function Parsesyslog(testo){
    const risultato = []
    const righe = testo.split('\n')

    for(const riga of righe){

        if(!riga.includes('Matrix loaded for skid number')){
            continue
        }

        const skidMatch =
            riga.match(/skid number:\s*(\d+)/i)

        const amountMatch =
            riga.match(/amount loaded:\s*([\d,]+)/i)

        const systemMatch =
            riga.match(/Loaded from system:\s*([A-Z0-9]+)/i)

        const matrixMatch =
            riga.match(/MX\s+(R[0-9A-Z]+\s+(?:MET|UNI|PR))/i)

        const colorCodeMatch =
            riga.match(/Color code:\s*([A-Z0-9]+)/i)

        const timestampMatch =
            riga.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+/)

        risultato.push({

            skid:
                skidMatch
                    ? Number(skidMatch[1])
                    : null,

            matrice:
                matrixMatch
                    ? matrixMatch[1]
                    : null,

            mlCaricati:
                amountMatch
                    ? parseFloat(
                        amountMatch[1]
                        .replace(',', '.')
                    )
                    : null,

            sistema:
                systemMatch
                    ? systemMatch[1]
                    : null,

            codice_Colore:
                colorCodeMatch
                ? colorCodeMatch[1]
                : null,

            data_ora:
                timestampMatch
                ? timestampMatch[0]
                : null,
            

        })
    }

    return risultato
}

export function bySkid(risultato){
    const lista_skid = {}

    for (const elemento of risultato){

        if(!lista_skid[elemento.skid]){
            lista_skid[elemento.skid] = []
        }

        lista_skid[elemento.skid].push(elemento)
    }

    return lista_skid
}