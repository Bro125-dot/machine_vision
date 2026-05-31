import Skid from '../components/Card'
import Navbar from '../components/Navbar'
import { Layout } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'


const API_URL = 'https://machine-vision-vv40.onrender.com'

function Pagelistskids() {
  const { Content } = Layout
  const { cabina, robot } = useParams()
  const nav = useNavigate()

  const [skids, setSkids] = useState([])
  const [filtro, setFiltro] = useState({
    data: null,
    skid: null,
    colore: null
  })

  useEffect(() => {
    fetch(`${API_URL}/skids-overview?cabina=${cabina}&robot=${robot}`)
      .then(res => res.json())
      .then(response => {
        const skidObject = response.data || {}

        const skidArray = Object.values(skidObject).map(item => {
          const primoCmd = item.events?.cmd421?.[0]
          const primoMap = item.events?.maplog?.[0]
          const primoSyslog = item.events?.syslog?.[0]

          return {
            skid: item.skid,

            tempo:
              primoCmd?.timestamp ||
              primoMap?.timestamp ||
              primoSyslog?.data_ora ||
              '',

            tipologiaComando:
              primoCmd?.comando ||
              'Cmd421',

            programma:
              primoCmd?.programma ||
              '-',

            colore:
              primoCmd?.colore ||
              primoMap?.colore ||
              '-',

            events: item.events
          }
        })

        setSkids(skidArray)
      })
      .catch(error => {
        console.error('Errore caricamento skids:', error)
      })
  }, [cabina, robot])

  const skidfiltrati = skids.filter((skid) => {
    if (filtro.data && !skid.tempo.includes(filtro.data)) {
      return false
    }

    if (filtro.skid && Number(skid.skid) !== Number(filtro.skid)) {
      return false
    }

    if (filtro.colore && Number(skid.colore) !== Number(filtro.colore)) {
      return false
    }

    return true
  })

  const Items = [
    {
      key: 1,
      label: 'Home',
      onClick: () => nav('/')
    },
    {
      key: 2,
      label: 'Indietro',
      onClick: () => nav(-1)
    }
  ]

  return (
    <>
      <Navbar items={Items} filtro={filtro} setFiltro={setFiltro} />

      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 30,
          padding: 20
        }}
      >
        <Skid
          skids={skidfiltrati}
          onclick={(skid) =>
            nav(`/pages-skid/${cabina}/${robot}/${skid.skid}`, {
              state: { skid }
            })
          }
        />
      </Content>
    </>
  )
}

export default Pagelistskids