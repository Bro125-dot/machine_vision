import {Layout , Card , Dropdown , Button} from 'antd'
import { useParams , useLocation } from 'react-router-dom';
import { BarsOutlined } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'
import image from '../assets/IRB 5500.jpg'
import { ArrowLeftOutlined } from '@ant-design/icons';
import GeneralNav from '../components/General_navbar'

function Robots(){
    const {Header , Content} = Layout
    const {cabina} = useParams()
    const location = useLocation()
    const robots = location.state?.robots
    const nav = useNavigate()
    const robot_image = image
    function Handleclickmatrix(cabina,robot){
        nav(`/matrix-display/${cabina}/${robot}`)
    }
    function Handleclickskids(cabina,robot){
        nav(`/skids/${cabina}/${robot}`)
    }
    const stylecard = {
        width: 260,
        height: 440,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: 0
    }
    const styleimage = {
        width: '100%',
        height: 200,
        objectFit: 'contain'
    }
    const stylecontent = {
        display : 'flex',
        flexDirection : 'row',
        padding : 30 , 
        alignItems : 'center',
        justifyContent : 'center',
        gap : 200
    }
    const cabinasenzamatrice = cabina === 'CC0' || cabina === 'CC1'
    return (
        <>
            <GeneralNav parola='Robots'/>
            <Content style={stylecontent}>
                {
                    robots.map((element) => (
                        <Card
                            style={stylecard}
                            cover={<img draggable="false" style={styleimage} src={robot_image} />}
                        >
                            <div style={{
                                padding: 12,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 20
                                }}>
                                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
                                    {cabina}
                                </h3>
                                <p style={{ margin: 0, fontSize: 16, opacity: 0.7 }}>
                                    {element}
                                </p>
                                {
                                    cabinasenzamatrice ? 
                                    <Button type='primary' onClick={() => Handleclickskids(cabina,element)}>Skid fatti</Button> :  
                                    <div style={{display : 'flex' , justifyContent : 'center',flexDirection : 'column' , gap : 10}}>
                                        <Button type='primary' onClick={() => Handleclickmatrix(cabina,element)}>Matrici</Button>
                                        <Button type='primary' onClick={() => Handleclickskids(cabina,element)}>Skid fatti</Button>
                                    </div>
                                }
                            </div>
                        </Card>
                    ))
                }
                
            </Content>
        </>
    )
}

export default Robots;