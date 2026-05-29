import Message from './Message.jsx'


function MessageList(props){
    var listeMsg = props.liste;


    if(!listeMsg) return(<></>)
    
    return(
        <>
        <div className="message_list">
            {listeMsg.map((m) => {
                return <Message 
                    idMessage={m._id}
                    authorId={m.authorId} 
                    author={m.userName} 
                    content={m.content} 
                    date={m.date} 
                    avatar={m.avatar}
                    onUserClick={props.onUserClick} 
                    idReponse={m.idReponse}
                    forum={m.forum}
                    onDelete={props.onDelete}
                    showDelete={props.showDelete}
                />
            })}
        </div>
        </>
    )




}

export default MessageList;