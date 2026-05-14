import Message from './Message.jsx'


function MessageList(props){
    var listeMsg = props.liste;

    return(
        <>
        <div className="message_list">
            {listeMsg.map((m)=>{return <Message author={m.userName} content={m.content} date={m.date} />})}
        </div>
        </>
    )




}

export default MessageList;