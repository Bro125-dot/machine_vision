import { Loadcmddata } from '../services/loadercmd.js'

const data = Loadcmddata()

const CMD_EVENTS = {
  "Cmd1": {
    "name": "Mastership Acquire",
    "description": "Richiede il controllo esclusivo del controller ABB."
  },
  "Cmd2": {
    "name": "Mastership Release",
    "description": "Rilascia il controllo esclusivo del controller."
  },
  "Cmd101": {
    "name": "Reset",
    "description": "Reset del controller."
  },
  "Cmd102": {
    "name": "Stop",
    "description": "Quick stop dei robot coinvolti nel processo."
  },
  "Cmd103": {
    "name": "Continue",
    "description": "Riprende produzione, programma o cambio materiale."
  },
  "Cmd106": {
    "name": "Auto Mode Ack",
    "description": "Conferma il passaggio a modalità automatica."
  },
  "Cmd107": {
    "name": "Start",
    "description": "Riavvia il task principale e abilita i motori."
  },
  "Cmd110": {
    "name": "Motors On",
    "description": "Accensione motori robot."
  },
  "Cmd140": {
    "name": "Request Manual",
    "description": "Richiede modalità manuale a velocità ridotta."
  },
  "Cmd141": {
    "name": "Request Auto",
    "description": "Richiede modalità automatica."
  },
  "Cmd203": {
    "name": "Resume Material Change",
    "description": "Riprende il cambio materiale."
  },
  "Cmd204": {
    "name": "Cancel Material Change",
    "description": "Annulla il cambio materiale."
  },
  "Cmd302": {
    "name": "Applicator Enable",
    "description": "Abilita l'applicatore vernice."
  },
  "Cmd303": {
    "name": "Applicator Disable",
    "description": "Disabilita l'applicatore vernice."
  },
  "Cmd314": {
    "name": "HV Enable",
    "description": "Abilita l'alta tensione degli applicatori."
  },
  "Cmd315": {
    "name": "HV Disable",
    "description": "Disabilita l'alta tensione degli applicatori."
  },
  "Cmd401": {
    "name": "Material Load",
    "description": "Carica un materiale nel robot."
  },
  "Cmd405": {
    "name": "High Priority Program",
    "description": "Inserisce un programma prioritario."
  },
  "Cmd413": {
    "name": "Program Loaded",
    "description": "Robot pronto e in attesa dello start esterno."
  },
  "Cmd421": {
    "name": "Append Job",
    "description": "Inserisce un job in coda."
  },
  "Cmd422": {
    "name": "Insert Job",
    "description": "Inserisce un job in una posizione specifica della coda."
  },
  "Cmd750": {
    "name": "Material Change Operation",
    "description": "Operazioni avanzate del motore cambio materiale."
  }
}

function secondsBetween(start, end) {
  if (!start || !end) return null

  const startDate = new Date(start.replace(' ', 'T'))
  const endDate = new Date(end.replace(' ', 'T'))

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null
  }

  return Math.round((endDate - startDate) / 1000)
}

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return null
  if (seconds < 0) return null

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes === 0) {
    return `${remainingSeconds} sec`
  }

  return `${minutes} min ${remainingSeconds} sec`
}

function parseCmdLine(riga) {
  if (!riga || !riga.trim()) return null

  const parti = riga.split(',')

  if (parti.length < 4) return null

  const timestamp = parti[0]
  const source = parti[1]
  const comando = parti[3]

  if (!comando?.startsWith('Cmd')) return null

  return {
    timestamp,
    source,
    comando,
    params: parti.slice(4),
    raw: riga
  }
}

function parseCmd421FromParts(parti) {
  return {
    skid: Number(parti[parti.length - 1]),
    timestamp: parti[0],
    comando: parti[3],
    programma: parti[4],
    colore: parti[5],
    bit: parti.slice(6, 9)
  }
}

export function robot_chiavi(data) {
  const robotData = {}

  for (let i = 0; i < data.length; i++) {
    const chiave = data[i].cabina + '_' + data[i].robot

    if (!robotData[chiave]) {
      robotData[chiave] = ''
    }

    robotData[chiave] += data[i].content
  }

  return robotData
}

export function cmd421(testo) {
  const risultato = {}
  const chiavi = Object.keys(testo)

  for (let chiave of chiavi) {
    risultato[chiave] = []

    const righe = testo[chiave].split('\n')

    for (let riga of righe) {
      if (!riga.includes('Cmd421')) continue

      const parti = riga.split(',')

      if (parti.length < 14 || parti[1] === 'RPD' || parti[1] === 'RA2') continue

      risultato[chiave].push(parseCmd421FromParts(parti))
    }
  }

  return risultato
}

export function parseProcessiByRobot(testo) {
  const risultato = {}
  const chiavi = Object.keys(testo)

  for (const chiave of chiavi) {
    risultato[chiave] = {}

    const righe = testo[chiave]
      .split('\n')
      .map(parseCmdLine)
      .filter(Boolean)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

    let processoCorrente = null

    for (const event of righe) {
      const comandoInfo = CMD_EVENTS[event.comando]

      if (!comandoInfo) continue

      if (event.comando === 'Cmd421') {
        if (processoCorrente) {
          processoCorrente.fineProcesso = event.timestamp
          processoCorrente.timeline.push({
            timestamp: event.timestamp,
            comando: event.comando,
            evento: 'Fine ciclo / nuovo job',
            categoria: 'job'
          })

          processoCorrente.durataApplicazioneSecondi = secondsBetween(
            processoCorrente.inizioApplicazione,
            processoCorrente.fineProcesso
          )

          processoCorrente.durataApplicazione = formatDuration(
            processoCorrente.durataApplicazioneSecondi
          )
        }

        const parti = event.raw.split(',')
        const cmd421Data = parseCmd421FromParts(parti)
        const skid = Number(cmd421Data.skid)

        processoCorrente = {
          skid,
          jobRicevuto: event.timestamp,
          inizioApplicazione: null,
          fineProcesso: null,
          durataApplicazioneSecondi: null,
          durataApplicazione: null,
          note: null,
          anomalie: {
            stop: 0,
            recovery: 0,
            manuale: false,
            cambioMateriale: false,
            controlloPLC: false,
            controlloTeachPendant: false
          },
          timeline: [
            {
              timestamp: event.timestamp,
              comando: event.comando,
              evento: comandoInfo.evento,
              categoria: comandoInfo.categoria,
              programma: cmd421Data.programma,
              colore: cmd421Data.colore
            }
          ]
        }

        if (!risultato[chiave][String(skid)]) {
          risultato[chiave][String(skid)] = []
        }

        risultato[chiave][String(skid)].push(processoCorrente)

        continue
      }

      if (!processoCorrente) continue

      const timelineEvent = {
        timestamp: event.timestamp,
        comando: event.comando,
        evento: comandoInfo.evento,
        categoria: comandoInfo.categoria
      }

      processoCorrente.timeline.push(timelineEvent)

      if (event.comando === 'Cmd413' && !processoCorrente.inizioApplicazione) {
        processoCorrente.inizioApplicazione = event.timestamp
      }

      if (event.comando === 'Cmd102') {
        processoCorrente.anomalie.stop += 1
      }

      if (event.comando === 'Cmd107') {
        processoCorrente.anomalie.recovery += 1
      }

      if (event.comando === 'Cmd140') {
        processoCorrente.anomalie.manuale = true
      }

      if (event.comando === 'Cmd750' || event.comando === 'Cmd401') {
        processoCorrente.anomalie.cambioMateriale = true
      }

      if (event.comando === 'Cmd1') {
        processoCorrente.anomalie.controlloPLC = true
      }

      if (event.comando === 'Cmd2') {
        processoCorrente.anomalie.controlloTeachPendant = true
      }
    }

    if (processoCorrente && !processoCorrente.fineProcesso) {
      processoCorrente.note = 'Fine processo non trovata: manca il Cmd421 successivo'

      if (!processoCorrente.inizioApplicazione) {
        processoCorrente.note = 'Cmd413 non trovato: inizio applicazione non disponibile'
      }
    }

    for (const skidKey of Object.keys(risultato[chiave])) {
      for (const processo of risultato[chiave][skidKey]) {
        if (!processo.inizioApplicazione && !processo.note) {
          processo.note = 'Cmd413 non trovato: inizio applicazione non disponibile'
        }

        if (processo.inizioApplicazione && processo.fineProcesso) {
          processo.durataApplicazioneSecondi = secondsBetween(
            processo.inizioApplicazione,
            processo.fineProcesso
          )

          processo.durataApplicazione = formatDuration(
            processo.durataApplicazioneSecondi
          )
        }
      }
    }
  }

  return risultato
}