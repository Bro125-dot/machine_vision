import { Button , InputNumber , DatePicker , Layout , Dropdown} from 'antd'
import { BarsOutlined } from '@ant-design/icons';

function Navbar({items , filtro , setFiltro}){
    const {Header} = Layout
    return(
        <>
            <Header
                style={{
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
                        }}
                    >
                    <div style={{display : 'flex' , flex : 1}}>
                        <Dropdown menu ={{ items }} trigger={['click']}>
                            <Button type="text" icon={<BarsOutlined style={{ fontSize : '36px'}}/>}/>
                        </Dropdown>
                    </div>
                    <form style={{display : 'flex' , gap : '20px' , flex : 1  , justifyContent : 'end'}}>
                        <DatePicker onChange={(date , dateString) => setFiltro(prev => ({
                            ...prev,
                            data : dateString
                        }))}/>
                        <InputNumber min={1} placeholder="skid" onChange={(value) => setFiltro(prev => ({
                            ...prev,
                            skid : value
                        }))} />
                        <InputNumber min={1} max={160} placeholder="colore" onChange={(value) => setFiltro(prev => ({
                            ...prev,
                            colore : value
                        }))} />
                    </form>
            </Header>
        </>
    )
}

export default Navbar;