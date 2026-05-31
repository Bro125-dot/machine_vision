import { Card , Layout , Button , Form , DatePicker , Dropdown} from 'antd'
import { BarsOutlined } from '@ant-design/icons';
import { useParams , useNavigate } from 'react-router-dom'
import {useEffect , useState} from 'react'

const API_URL = 'https://machine-vision-vv40.onrender.com'


function Pagematrix(){
    const {Header , Content} = Layout
    const {cabina , robot , matrice} = useParams()
    console.log(cabina,robot,matrice)
    let conteggioCarichi = 0
    let conteggioRecuperi = 0 
    let conteggioLavaggi = 0
    const nav = useNavigate()
    const [infomatrice , setInfomatrice] = useState()
    useEffect(()=>{
        fetch(`${API_URL}/matrici/${robot}/${matrice}`)
        .then(res => res.json())
        .then(data => (
            setInfomatrice(data)
        ))

    },[robot,matrice])

    const styleheader = {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80px',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        paddingInline: '24px'
    }
    const styleContent = {
        display : 'flex', 
        justifyContent : 'center' ,
        alignItems : 'center',
        flexWrap : 'wrap' ,
        gap : 50 , 
        padding : 20
    }
    const styleCard = {
        height : 600,
        width : 400,
        boxShadow: '0 8px 12px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection : 'column',
    }
    const items = [
        {
            key : 1,
            label : 'Home',
            onClick : () => nav('/')
        },
        {
            key : 2,
            label : 'Indietro',
            onClick : () => nav(-1)
        }
    ]
    return (
        <>
            <Header style={styleheader}>
                <div style={{flex : 1 , display : 'flex' , justifyContent : 'start' , marginLeft : 30 }}>
                    <Dropdown menu ={{ items }} trigger={['click']}>
                        <Button type="text" icon={<BarsOutlined style={{ fontSize : '36px'}}/>}/>
                    </Dropdown>
                </div>
                <div style={{flex : 1 , display : 'flex' , justifyContent : 'end' , marginLeft : 30 }}>
                    <DatePicker/>
                </div>   
            </Header>
            <Content style={styleContent}>
                <Card style={styleCard} title={matrice}>
                    {infomatrice && infomatrice.modes.map((element , index) => (
                        <Card style={{marginTop : 30}} key={index}>
                            <h4>data : {element.data}</h4>
                            <h4>ora : {element.ora}</h4>
                            <h4>modalità : {element.mode}</h4>
                        </Card>
                    ))}
                </Card>
                <Card style={styleCard} title='Statistiche'>
                    <h4>N. Carichi : {infomatrice ? infomatrice.counts.carichi : null}</h4>
                    <h4>N. Recuperi : { infomatrice ? infomatrice.counts.recuperi : null}</h4>
                    <h4>N. Lavaggi : { infomatrice ? infomatrice.counts.lavaggi : null}</h4>
                </Card>
            </Content>
        </>
    )
}

export default Pagematrix