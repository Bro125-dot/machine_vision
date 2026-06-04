import { Layout, Button, Card, Dropdown, List, Typography, Empty, Tag, Statistic } from 'antd'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BarsOutlined } from '@ant-design/icons'

function Pageskid() {
  const { Header, Content } = Layout
  const nav = useNavigate()
  const location = useLocation()
  const { cabina, robot, skid: skidParam } = useParams()

  const skid = location.state?.skid
  console.log('SKID RICEVUTO:', skid)
  console.log('PROCESSO:', skid?.events?.processo)

  const styleHeader = {
    height: 60,
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 20,
    background: 'rgba(236, 238, 252, 0.75)',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  }

  const styleContent = {
    display: 'flex',
    flexDirection: 'row',
    gap: 50,
    padding: 30,
    alignItems: 'flex-start',
    justifyContent: 'center'
  }

  const styleCard = {
    height: 600,
    width: 400,
    overflowY: 'auto',
    boxShadow: '0 8px 12px rgba(0,0,0,0.06)'
  }

  const items = [
    {
      key: 'home',
      label: 'Home',
      onClick: () => nav('/')
    },
    {
      key: 'back',
      label: 'Indietro',
      onClick: () => nav(-1)
    }
  ]

  if (!skid) {
    return (
      <>
        <Header style={styleHeader}>
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button type="text" icon={<BarsOutlined style={{ fontSize: '32px' }} />} />
          </Dropdown>
        </Header>

        <Content style={{ padding: 30 }}>
          <Card>
            Nessun dato trovato per lo skid {skidParam}. Torna alla lista e clicca di nuovo lo skid.
          </Card>
        </Content>
      </>
    )
  }

  const cmd421 = skid.events?.cmd421 || []
  const maplog = skid.events?.maplog || []
  const syslog = skid.events?.syslog || []
  const processo = skid.events?.processo?.[0] || null
  const timeline = processo?.timeline || []
  const anomalie = processo?.anomalie || {}

  return (
    <>
      <Header style={styleHeader}>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button type="text" icon={<BarsOutlined style={{ fontSize: '32px' }} />} />
        </Dropdown>

        <Typography.Title level={4} style={{ margin: 0, marginLeft: 20 }}>
          {cabina} - {robot} - Skid {skid.skid}
        </Typography.Title>
      </Header>

      <Content style={styleContent}>
        <Card title="Bit" style={{ ...styleCard, backgroundColor: '#dcfce7' }}>
          {cmd421.length === 0 ? (
            <Empty description="Nessun dato bit" />
          ) : (
            <List
              dataSource={cmd421}
              renderItem={(item, index) => (
                <List.Item key={`${item.timestamp}-${index}`}>
                  <div>
                    <b>{item.timestamp}</b>
                    <div>Comando: {item.comando}</div>
                    <div>Programma: {item.programma}</div>
                    <div>Colore: {item.colore}</div>
                    <div>Bit: {item.bit?.join(', ')}</div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card title="Consumi" style={{ ...styleCard, backgroundColor: '#ebfdf0' }}>
          <Typography.Title level={5}>Maplog</Typography.Title>

          {maplog.length === 0 ? (
            <Empty description="Nessun consumo maplog" />
          ) : (
            <List
              dataSource={maplog}
              renderItem={(item, index) => (
                <List.Item key={`${item.timestamp}-${index}`}>
                  <div>
                    <b>{item.timestamp}</b>
                    <div>Consumo: {item.consumo ?? '-'}</div>
                    <div>Calcul Vol: {item.calcul_Vol ?? '-'}</div>
                    <div>Colore: {item.colore ?? '-'}</div>
                  </div>
                </List.Item>
              )}
            />
          )}

          <Typography.Title level={5}>Syslog matrici</Typography.Title>

          {syslog.length === 0 ? (
            <Empty description="Nessun consumo syslog" />
          ) : (
            <List
              dataSource={syslog}
              renderItem={(item, index) => (
                <List.Item key={`${item.data_ora}-${index}`}>
                  <div>
                    <b>{item.data_ora}</b>
                    <div>Matrice: {item.matrice}</div>
                    <div>ml caricati: {item.mlCaricati}</div>
                    <div>Sistema: {item.sistema}</div>
                    <div>Codice colore: {item.codice_Colore}</div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card title="Processo" style={{ ...styleCard, backgroundColor: '#f4fef7' }}>
          {!processo ? (
            <Empty description="Nessun dato processo" />
          ) : (
            <>
              <Statistic
                title="Durata applicazione"
                value={processo.durataApplicazione || 'N/D'}
              />

              <div style={{ marginTop: 20 }}>
                <div><b>Job ricevuto:</b> {processo.jobRicevuto || '-'}</div>
                <div><b>Inizio applicazione:</b> {processo.inizioApplicazione || '-'}</div>
                <div><b>Fine processo:</b> {processo.fineProcesso || '-'}</div>
              </div>

              {processo.note && (
                <div style={{ marginTop: 15 }}>
                  <Tag color="orange">{processo.note}</Tag>
                </div>
              )}

              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {anomalie.stop > 0 && <Tag color="red">Stop: {anomalie.stop}</Tag>}
                {anomalie.recovery > 0 && <Tag color="blue">Recovery: {anomalie.recovery}</Tag>}
                {anomalie.manuale && <Tag color="orange">Manuale</Tag>}
                {anomalie.cambioMateriale && <Tag color="purple">Cambio materiale</Tag>}
                {anomalie.controlloPLC && <Tag color="green">Controllo PLC</Tag>}
                {anomalie.controlloTeachPendant && <Tag color="volcano">Teach Pendant</Tag>}
              </div>

              <Typography.Title level={5} style={{ marginTop: 25 }}>
                Timeline
              </Typography.Title>

              {timeline.length === 0 ? (
                <Empty description="Nessuna timeline" />
              ) : (
                <div>
                {timeline.map((item, index) => (
                    <Card
                    size="small"
                    key={`${item.timestamp}-${item.comando}-${index}`}
                    style={{ marginBottom: 10 }}
                    >
                    <b>{item.timestamp}</b>
                    <div>{item.evento}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                        {item.comando} - {item.categoria}
                    </div>
                    </Card>
                ))}
                </div>
              )}
            </>
          )}
        </Card>
      </Content>
    </>
  )
}

export default Pageskid