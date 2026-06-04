import { Loadcmddata } from '../services/loadercmd.js'

const data = Loadcmddata()

const CMD_EVENTS = {
  Cmd1: {
    name: 'Controllo PLC',
    description: 'I robot tornano sotto comando PLC.'
  },
  Cmd2: {
    name: 'Controllo Teach Pendant',
    description: 'I robot sono comandati da controller / teach pendant.'
  },
  Cmd101: {
    name: 'Reset',
    description: 'Reset del controller.'
  },
  Cmd102: {
    name: 'Stop',
    description: 'Quick stop dei robot coinvolti nel processo.'
  },
  Cmd103: {
    name: 'Continue',
    description: 'Riprende produzione, programma o cambio materiale.'
  },
  Cmd106: {
    name: 'Auto Mode Ack',
    description: 'Conferma il passaggio a modalità automatica.'
  },
  Cmd107: {
    name: 'Start / Recovery',
    description: 'Riavvia il task principale e abilita i motori.'
  },
  Cmd110: {
    name: 'Motors On',
    description: 'Accensione motori robot.'
  },
  Cmd140: {
    name: 'Cabina in Manuale',
    description: 'La cabina viene messa in manuale.'
  },
  Cmd141: {
    name: 'Richiesta Automatico',
    description: 'Richiede modalità automatica.'
  },
  Cmd203: {
    name: 'Resume Material Change',
    description: 'Riprende il cambio materiale.'
  },
  Cmd204: {
    name: 'Cancel Material Change',
    description: 'Annulla il cambio materiale.'
  },
  Cmd302: {
    name: 'Applicatore ON',
    description: 'Abilita l applicatore vernice.'
  },
  Cmd303: {
    name: 'Applicatore OFF',
    description: 'Disabilita l applicatore vernice.'
  },
  Cmd314: {
    name: 'HV ON',
    description: 'Abilita alta tensione degli applicatori.'
  },
  Cmd315: {
    name: 'HV OFF',
    description: 'Disabilita alta tensione degli applicatori.'
  },
  Cmd401: {
    name: 'Carico materiale',
    description: 'Carica un materiale nel robot.'
  },
  Cmd405: {
    name: 'Programma prioritario',
    description: 'Inserisce un programma prioritario.'
  },
  Cmd413: {
    name: 'External Start / Inizio applicazione',
    description: 'Robot pronto, external start ricevuto. Inizio reale applicazione.'
  },
  Cmd421: {
    name: 'Job ricevuto',
    description: 'Il PLC ha ricevuto il job con i dati dello skid.'
  },
  Cmd422: {
    name: 'Inserimento job',
    description: 'Inserisce un job in una posizione specifica della coda.'
  },
  Cmd750: {
    name: 'Cambio materiale',
    description: 'Operazione avanzata del motore cambio materiale.'
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

function subtractSeconds(timestamp, seconds) {
  if (!timestamp) return null

  const date = new Date(timestamp.replace(' ', 'T'))

  if (Number.isNaN(date.getTime())) return null

  date.setSeconds(date.getSeconds() - seconds)

  return date.toISOString().slice(0, 19).replace('T', ' ')
}

function closeProcesso(processo, fineTimestamp, nextStartTimestamp = null) {
  if (!processo || processo.fineProcesso) return

  processo.fineProcesso = fineTimestamp
  processo.nextExternalStart = nextStartTimestamp

  processo.durataApplicazioneSecondi = secondsBetween(
    processo.inizioApplicazione,
    processo.fineProcesso
  )

  processo.durataApplicazione = formatDuration(
    processo.durataApplicazioneSecondi
  )

  processo.timeline.push({
    timestamp: fineTimestamp,
    comando: 'CALC',
    evento: 'Fine applicazione stimata',
    categoria: 'processo',
    note: 'Calcolata come prossimo Cmd413 meno 40 secondi'
  })
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

function getCategoria(comando) {
  if (comando === 'Cmd421' || comando === 'Cmd422' || comando === 'Cmd405') {
    return 'job'
  }

  if (comando === 'Cmd413') {
    return 'processo'
  }

  if (comando === 'Cmd102') {
    return 'anomalia'
  }

  if (comando === 'Cmd107') {
    return 'recovery'
  }

  if (comando === 'Cmd140' || comando === 'Cmd141' || comando === 'Cmd106') {
    return 'modo'
  }

  if (comando === 'Cmd750' || comando === 'Cmd401' || comando === 'Cmd203' || comando === 'Cmd204') {
    return 'materiale'
  }

  if (comando === 'Cmd302' || comando === 'Cmd303' || comando === 'Cmd314' || comando === 'Cmd315') {
    return 'verniciatura'
  }

  if (comando === 'Cmd1' || comando === 'Cmd2' || comando === 'Cmd101' || comando === 'Cmd103' || comando === 'Cmd110') {
    return 'controllo'
  }

  return 'altro'
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
    let ultimoProcessoConStart = null

    for (const event of righe) {
      const comandoInfo = CMD_EVENTS[event.comando]

      if (!comandoInfo) continue

      if (event.comando === 'Cmd421') {
        const parti = event.raw.split(',')
        const cmd421Data = parseCmd421FromParts(parti)
        const skid = Number(cmd421Data.skid)

        processoCorrente = {
          skid,
          jobRicevuto: event.timestamp,

          // nuova logica:
          // inizio = primo Cmd413 dopo il Cmd421
          // fine = prossimo Cmd413 meno 40 secondi
          inizioApplicazione: null,
          fineProcesso: null,
          nextExternalStart: null,

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
              evento: 'Job ricevuto',
              categoria: 'job',
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
        evento: comandoInfo.name,
        categoria: getCategoria(event.comando),
        description: comandoInfo.description
      }

      processoCorrente.timeline.push(timelineEvent)

      if (event.comando === 'Cmd413') {
        // Questo Cmd413 è l external start del processo corrente.
        if (!processoCorrente.inizioApplicazione) {
          processoCorrente.inizioApplicazione = event.timestamp
        }

        // Lo stesso Cmd413 indica anche che il processo precedente è finito
        // circa 40 secondi prima.
        if (
          ultimoProcessoConStart &&
          ultimoProcessoConStart !== processoCorrente &&
          !ultimoProcessoConStart.fineProcesso
        ) {
          const fineStimata = subtractSeconds(event.timestamp, 40)
          closeProcesso(ultimoProcessoConStart, fineStimata, event.timestamp)
        }

        ultimoProcessoConStart = processoCorrente
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

    for (const skidKey of Object.keys(risultato[chiave])) {
      for (const processo of risultato[chiave][skidKey]) {
        if (!processo.inizioApplicazione) {
          processo.note = 'Cmd413 non trovato: inizio applicazione non disponibile'
          continue
        }

        if (!processo.fineProcesso) {
          processo.note = 'Fine processo non trovata: manca il Cmd413 successivo'
          continue
        }

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

  return risultato
}