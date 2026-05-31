import { Loadcmddata } from '../services/loadercmd.js'
import { Loadmapdata } from '../services/loadermap.js'

import {
  robot_chiavi as cmdRobotChiavi,
  cmd421
} from './cmdparser.js'

import {
  parseMapByRobot
} from './mapparser.js'

import {
  loadLogFile,
  Parsesyslog,
  bySkid
} from './infosyslogparser.js'

export function buildSkidOverview(targetDate = '2026-05-18') {
  const result = {}

  const excludedCabine = ['CC0', 'CC1']

  const cmdRaw = Loadcmddata()
  const cmdGrouped = cmdRobotChiavi(cmdRaw)
  const cmdParsed = cmd421(cmdGrouped)

  const mapRaw = Loadmapdata()
  const mapParsed = parseMapByRobot(mapRaw)

  const syslogText = loadLogFile()
  const syslogParsed = Parsesyslog(syslogText)
  const syslogGroupedBySkid = bySkid(syslogParsed)

  for (const robotKey of Object.keys(cmdParsed)) {
    const [cabina, robot] = robotKey.split('_')

    if (excludedCabine.includes(cabina)) continue

    if (!result[cabina]) {
      result[cabina] = {}
    }

    if (!result[cabina][robot]) {
      result[cabina][robot] = {}
    }

    for (const cmdEvent of cmdParsed[robotKey]) {
      const skid = Number(cmdEvent.skid)
      const timestamp = String(cmdEvent.timestamp || '')

      if (!timestamp.startsWith(targetDate)) continue
      if (skid > 300) continue

      const skidKey = String(skid)

      if (!result[cabina][robot][skidKey]) {
        result[cabina][robot][skidKey] = {
          skid,
          events: {
            syslog: [],
            cmd421: [],
            maplog: []
          }
        }
      }

      result[cabina][robot][skidKey].events.cmd421.push({
        ...cmdEvent,
        skid,
        robot
      })
    }
  }

  for (const robotKey of Object.keys(mapParsed)) {
    const [cabina, robot] = robotKey.split('_')

    if (excludedCabine.includes(cabina)) continue
    if (!result[cabina]) continue
    if (!result[cabina][robot]) continue

    for (const mapEvent of mapParsed[robotKey]) {
      const skid = Number(mapEvent.skid)
      const timestamp = String(mapEvent.timestamp || '')

      if (!timestamp.startsWith(targetDate)) continue
      if (skid > 300) continue

      const skidKey = String(skid)

      if (!result[cabina][robot][skidKey]) continue

      result[cabina][robot][skidKey].events.maplog.push({
        ...mapEvent,
        skid,
        robot
      })
    }
  }

  for (const cabina of Object.keys(result)) {
    for (const robot of Object.keys(result[cabina])) {
      for (const skidKey of Object.keys(result[cabina][robot])) {
        const syslogEvents = syslogGroupedBySkid[skidKey] || []

        result[cabina][robot][skidKey].events.syslog = syslogEvents.filter(event => {
          const skid = Number(event.skid)
          const timestamp = String(event.data_ora || '')

          return timestamp.startsWith(targetDate) && skid <= 300
        })
      }
    }
  }

  console.log('CABINE FINALI:', Object.keys(result))

  for (const cabina of Object.keys(result)) {
    console.log(cabina, Object.keys(result[cabina]))

    for (const robot of Object.keys(result[cabina])) {
      console.log(
        `${cabina}_${robot}`,
        'skid:',
        Object.keys(result[cabina][robot]).length
      )
    }
  }

  return result
}