import { Loadcmddata } from '../services/loadercmd.js'

const data = Loadcmddata()

export function robot_chiavi(data){
    const robotData = {}

    for (let i = 0; i < data.length; i++){
        const chiave = data[i].cabina + "_" + data[i].robot

        if (!robotData[chiave]){
            robotData[chiave] = ''
        }

        robotData[chiave] += data[i].content
    }

    return robotData
}

export function cmd421(testo){
    const risultato = {}
    const chiavi = Object.keys(testo)

    for (let chiave of chiavi){

        risultato[chiave] = []

        const righe = testo[chiave].split('\n')

        for (let riga of righe){

            if (!riga.includes('Cmd421')) continue

            const parti = riga.split(',')

            if (parti.length < 14 || parti[1] === 'RPD' || parti[1] === 'RA2') continue

            risultato[chiave].push({
                skid: Number(parti[parti.length - 1]),
                timestamp: parti[0],
                comando: parti[3],
                programma: parti[4],
                colore: parti[5],
                bit: parti.slice(6, 9),
            })
        }
    }

    return risultato
}