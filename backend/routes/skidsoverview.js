import express from 'express'
import { buildSkidOverview } from '../parsers/skids.js'

const router = express.Router()

router.get('/skids-overview', (req, res) => {
  try {
    const date = req.query.date || '2026-05-18'
    const cabina = req.query.cabina
    const robot = req.query.robot

    const data = buildSkidOverview(date)

    // Nessun filtro -> ritorna solo statistiche leggere
    if (!cabina && !robot) {
      return res.json({
        date,

        robot_presenti: {
          BC0: Object.keys(data.BC0 || {}),
          BC1: Object.keys(data.BC1 || {}),
          BC2: Object.keys(data.BC2 || {})
        },

        skid_count: {
          BC0_R12: Object.keys(data.BC0?.R12 || {}).length,
          BC0_R13: Object.keys(data.BC0?.R13 || {}).length,

          BC1_R22: Object.keys(data.BC1?.R22 || {}).length,
          BC1_R23: Object.keys(data.BC1?.R23 || {}).length,

          BC2_R31: Object.keys(data.BC2?.R31 || {}).length,
          BC2_R32: Object.keys(data.BC2?.R32 || {}).length,
          BC2_R33: Object.keys(data.BC2?.R33 || {}).length,
          BC2_R34: Object.keys(data.BC2?.R34 || {}).length
        },

        hint: [
          '/skids-overview?cabina=BC0',
          '/skids-overview?cabina=BC0&robot=R12',
          '/skids-overview?cabina=BC1&robot=R23',
          '/skids-overview?cabina=BC2&robot=R34'
        ]
      })
    }

    // filtro solo cabina
    if (cabina && !robot) {
      return res.json({
        date,
        cabina,
        data: data[cabina] || {}
      })
    }

    // filtro cabina + robot
    if (cabina && robot) {
      return res.json({
        date,
        cabina,
        robot,
        data: data[cabina]?.[robot] || {}
      })
    }

    res.json(data)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Errore durante la creazione dello skid overview',
      error: error.message
    })
  }
})

export default router