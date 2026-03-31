import Message from './Message.jsx'


function MessageList(props){
    const listeMsg = props.liste;


    return(
        <>
        <li>
        {listeMsg.map((m)=>{
            return <Message author={m.author} content={m.content}/>
        })
        }
        </li>
        </>
    )




}

export default MessageList;