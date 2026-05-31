import React from 'react'
import {Layout , Dropdown , Button} from 'antd'
import { BarsOutlined } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom'

function GeneralNav({parola}){
    const {Header} = Layout
    const nav = useNavigate()
    const styleHeader = {
        height : 60  , 
        display : 'flex' , 
        alignItems : 'center' , 
        padding : 5 , 
        paddingLeft : 20,
        background: 'rgba(236, 238, 252, 0.75)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
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
    return(
        <Header style={{display : 'flex',alignItems : 'center',backgroundColor : 'rgb(65, 154, 238)', fontSize : '24px', fontWeight : 'bold' , height : 80}}>
            <div style={{flex : 0.001 , display : 'flex' , justifyContent : 'start' , marginLeft : 30 }}>
                <Dropdown menu ={{ items }} trigger={['click']}>
                    <Button type="text" icon={<BarsOutlined style={{ fontSize : '36px'}}/>}/>
                </Dropdown>
            </div>
            <div style={{flex:1 , display : 'flex' , justifyContent : 'center' , fontFamily : 'sans-serif'}}>
                {parola}
            </div>
        </Header>
    )
}

export default GeneralNav;