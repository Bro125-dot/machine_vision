import { Loadmapdata } from "../services/loadermap.js";

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

export function parseMapLine(riga){
    const timestampMatch = riga.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    const skidMatch = riga.match(/Skid:\s*(\d+)/i)
    if (!timestampMatch || !skidMatch) {
        return null
    }

    const paintMatch = riga.match(/Paint\s*:\s*([\d.]+)/i)
    const calculMatch = riga.match(/Calcul Vol\s*:\s*([\d.]+)/i)
    const colorMatch = riga.match(/Color\s*:\s*([\d.]+)/i)

    if (!paintMatch && !calculMatch && !colorMatch) {
        return null
    }

    return {
        skid: Number(skidMatch[1]),
        timestamp: timestampMatch[0],
        consumo: paintMatch ? Number(paintMatch[1]) : null,
        colore: colorMatch ? Number(colorMatch[1]) : null,
        calcul_Vol: calculMatch ? Number(calculMatch[1]) : null,
    }
}

export function parseMapEvents(data, targetDate = '2026-05-18'){
    const risultato = {}

    for (const fileData of data){
        const cabina = fileData.cabina
        const robot = fileData.robot

        if (cabina === 'CC0' || cabina === 'CC1') continue

        if (!risultato[cabina]){
            risultato[cabina] = {}
        }

        if (!risultato[cabina][robot]){
            risultato[cabina][robot] = {
                skids: {},
            }
        }

        const righe = fileData.content.split('\n')

        for (const riga of righe){
            const parsed = parseMapLine(riga)
            if (!parsed) continue
            if (!parsed.timestamp.startsWith(targetDate)) continue

            const robotGroup = risultato[cabina][robot]
            const skidKey = String(parsed.skid)

            if (!robotGroup.skids[skidKey]){
                robotGroup.skids[skidKey] = {
                    timestamp: parsed.timestamp,
                    consumo: null,
                    colore: null,
                    calcul_Vol: null,
                }
            }

            const skidObj = robotGroup.skids[skidKey]
            if (parsed.consumo !== null) skidObj.consumo = parsed.consumo
            if (parsed.colore !== null) skidObj.colore = parsed.colore
            if (parsed.calcul_Vol !== null) skidObj.calcul_Vol = parsed.calcul_Vol

            if (parsed.timestamp > skidObj.timestamp) {
                skidObj.timestamp = parsed.timestamp
            }
        }
    }

    return risultato
}

export function parseMapByRobot(data){
    const risultato = {}

    for (const fileData of data){
        const chiave = `${fileData.cabina}_${fileData.robot}`
        if (!risultato[chiave]){
            risultato[chiave] = []
        }

        const righe = fileData.content.split('\n')
        for (const riga of righe){
            const parsed = parseMapLine(riga)
            if (!parsed) continue
            risultato[chiave].push(parsed)
        }
    }

    return risultato
}
