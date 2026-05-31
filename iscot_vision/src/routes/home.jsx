import {Layout , Button, Card} from 'antd'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

function Home(){
    const {Content , Header} = Layout
    const nav = useNavigate()

    const stylecontent = {
        display : 'flex' , 
        gap : 10 , 
        padding : 30,
        flexDirection : 'row' , 
        height : '100%' , 
        alignItems: 'center',
        justifyContent: 'center',
    }

    const stylecard = {
        display : 'flex',
        flexDirection : 'column',
        gap : 10,
        height : 200,
    }

    const styleheader = {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        height: '80px',
        backgroundColor : 'rgb(65, 154, 238)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        paddingInline: '24px',
        fontSize : 24,
        fontFamily : 'arial',
        fontWeight : 'bold'
    }

    function Handleclick(cabina , robots){
        nav(`/Robot/${cabina}`,{
            state :{robots}
        })
    }

    return(
        <>
                <Header style={styleheader}>Principale</Header>
                    <Content style={stylecontent}>
                        <Card title="Cabine" style={stylecard}>
                            <div style={{display : 'flex' , gap : 30}}>
                                <Button type="primary" onClick={() => Handleclick('BC0' , ['R12' , 'R13'])}>BC0</Button>
                                <Button type="primary" onClick={() => Handleclick('BC1' , ['R22' , 'R23'])}>BC1</Button>
                                <Button type="primary" onClick={() => Handleclick('BC2' , ['R31' , 'R32' , 'R33' , 'R34'])}>BC2</Button>
                                <Button type="primary" onClick={() => Handleclick('CC0' , ['R12' , 'R13'])}>CC0</Button>
                                <Button type="primary" onClick={() => Handleclick('CC1' , ['R22' , 'R23'])}>CC1</Button>
                            </div>
                        </Card>
                    </Content>
        </>
    )
}

export default Home;