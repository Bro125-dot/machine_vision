import {Card} from 'antd'


function Skid({skids , onclick}){
    const style ={
        display : 'flex',
        flexDirection : 'column', 
        justifyContent : 'center',
        width : 250 , 
        height : 250
    }
    return (
        <>
            {skids.map((element,index) => (
                <Card onClick={() => onclick(element)} key = {index} title={element.skid} style={{...style,backgroundColor : element.colore}}>
                    <h4>Data : {element.tempo}</h4>
                    <h4>Comando : {element.tipologiaComando}</h4>
                    <h4>Type : {element.programma}</h4>
                    <h4>Colore : {element.colore}</h4>
                </Card>
            ))}
        </>
    )
}

export default Skid; 