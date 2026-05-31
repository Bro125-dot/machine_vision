import loadLogFile from '../services/loaderpmr.js'
import matrici from '../data/matrici.json' with {type : 'json'}

const file= 'syslogpmr18-05.txt'

const righe = loadLogFile(file)
/* const lista_matrici = matrici.map((element) => {
    return element.nome
})

let stato_matrici = []

for (let i=0; i < lista_matrici.length ; i++){
    for (let j=0 ; j < righe.length ; j++){
        if (righe[j].includes(lista_matrici[i])){
            stato_matrici.push(righe[j])
        }
    }
} */

/* const matrice_selezionata = 'MX R12A PR'
const matrice_filtrata = righe.filter((element) => {
    return element.includes(matrice_selezionata)
} )

console.log(matrice_filtrata) */

export function parseLogLines(righe , id_matrice){
    return righe.filter((element) => {
        return element.includes(id_matrice)
    })
}


//const righe_filtrate_pulite = parseLogLines(righe,'MX R12A PR').map((element) => element.split(' '))



export function extractMode(righe_filtrate){
    const lista_azioni = []
    for (let riga of righe_filtrate){
        riga = riga.replace('\r' , '')
        const tindex = riga.indexOf('T')
        const data_ora = riga.substring(tindex - 10 , tindex + 13)
        const messaggio = riga.split(' (I) ')
        const azione = messaggio[1]
        if (azione && azione.includes('Matrix in auto')){
            const tempo = data_ora.split('T')
            const data = tempo[0]
            const ora = tempo[1].slice(0,8)
            lista_azioni.push({
                data : data,
                ora : ora,
                mode : azione
            })
        }
        if (azione && azione.includes('Matrix in hand')){
            const tempo = data_ora.split('T')
            const data = tempo[0]
            const ora = tempo[1].slice(0,8)
            lista_azioni.push({
                data : data,
                ora : ora,
                mode : azione
            })
        }
        if (azione && azione.includes('Matrix in service')){
            const tempo = data_ora.split('T')
            const data = tempo[0]
            const ora = tempo[1].slice(0,8)
            lista_azioni.push({
                data : data,
                ora : ora,
                mode : azione
            })
        }
    }  
    return lista_azioni
} 

export function extractStats(righe_filtrate){
    let cont_lavaggio = 0
    let cont_carico = 0
    let cont_recupero = 0
    for (let riga of righe_filtrate){
        const messaggio = riga.split(' (I) ')
        if (messaggio[1] && messaggio[1].includes('Matrix loaded.')){
            cont_carico = cont_carico + 1
        }
        if (messaggio[1] && messaggio[1].includes('Matrix recovered.')){
            cont_recupero = cont_recupero + 1
        }
        if (messaggio[1] && messaggio[1].includes('Matrix cleaned.')){
            cont_lavaggio = cont_lavaggio + 1
        }
    }
    return {
        lavaggi : cont_lavaggio,
        carichi : cont_carico,
        recuperi : cont_recupero
    }
}


console.log(extractMode(parseLogLines(righe,'MX R23A MET')))
console.log(extractStats(parseLogLines(righe,'MX R23A MET')))