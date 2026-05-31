import React from 'react'
import {Card , Layout , Dropdown , Button} from 'antd'
import matrici from '../List_elements/matrici.json'
import { BarsOutlined } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'
import {useParams} from 'react-router-dom'
import GeneralNav from '../components/General_navbar'


function MatrixDisplay(){
    const {Header , Content} = Layout
    const nav = useNavigate()
    const {robot , cabina} = useParams()
    const cardstyle = {
        width : 200 , 
        height : 200
    }
    function handleClick(cabina , robot,matrice){
        nav(`/pagematrix/${cabina}/${robot}/${matrice}`)
    }
    return(
        <>
            <Layout>
                <GeneralNav parola='Matrici'/>
                <Content style={{display : 'flex', justifyContent : 'center' ,alignItems : 'center',flexWrap : 'wrap' ,gap : 30 , padding : 20}}>
                    {matrici.map((element,index) =>(
                        element.nome.includes(robot) && element.cabina === cabina? <Card title = {element.nome} style={cardstyle} onClick={() => handleClick(cabina,robot,element.nome.replace(/\s/g, ' '))}/> : null
                    ))}
                </Content>
            </Layout>
        </>
    )
}

export default MatrixDisplay;