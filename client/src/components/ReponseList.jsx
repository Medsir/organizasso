import Reponse from './Reponse.jsx'


function ReponseList(props){
    var listeMsg = props.liste;


    if(!listeMsg) return(<></>)
    
    return(
        <>
        <div className="message_list">
            {listeMsg.map((m) => {
                return <Reponse 
                    idMessage={m._id}
                    authorId={m.authorId} 
                    author={m.userName} 
                    content={m.content} 
                    date={m.date} 
                    avatar={m.avatar}
                    onUserClick={props.onUserClick} 
                    idReponse={m.idReponse}
                    forum={m.forum}
                />
            })}
        </div>
        </>
    )




}

export default ReponseList;