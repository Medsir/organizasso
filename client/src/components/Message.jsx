import { useState } from 'react';
import axios from 'axios';
import '../css/message.css';
import ReponseList from './ReponseList.jsx';
 
function Message(props){
    const author = props.author
    const content = props.content;
    const authorId = props.authorId;
    const date = props.date; // a gérer plus tard
    const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
    const avatarUrl = props.avatar == "default" ? defaultAvatarUrl : props.avatar
    const idReponse = props.idReponse
    const idMessage = props.idMessage
    const forum = props.forum

    const [reponses, setReponses] = useState([]);
    const [affichageReponses, setAffichageReponses] = useState(false);
    const [repContent, setRepContent] = useState("");


    const majContent = ()=>{
        const c = document.getElementById("input_reponse").value;
        setRepContent(c);
    }


    const repondreMessage = async(event) =>{
        event.preventDefault();

        
        const content = repContent;
        if(!content || content == ''){
            return -1;
        }
        axios.put("http://localhost:3000/messages", {content:content,forum:forum, idReponse:idMessage}, {withCredentials:true}).then(
            (res)=>{
                
                document.getElementById("input_reponse").value = "";
                majContent();
            }
        ).catch(
                (error) => {
                    console.error(error);
                }
            )
    

    }


    const chargementReponses = async (event) =>{
        event.preventDefault();
        if(affichageReponses){ 
            setAffichageReponses(false);
            return;
        }
        const res = await axios.get("http://localhost:3000/messages?idReponse="+idMessage, {withCredentials:true}).then(
        (res) =>{
            setReponses(res.data);
            setAffichageReponses(true);
        }
        ).catch(
            (error) =>{
                console.error(error)
                alert("Impossible de charger les reponses du message.")
            }
        )


    }


    return(
        <div className="message_display">
            <div className="message_header">
            <img className="message_avatar" src={avatarUrl} alt='pfp' />
            <p className="message_author" onClick={() => { if(props.onUserClick) props.onUserClick(authorId) }}>{author}</p>

            </div>
            <p className="message_content">{content}</p>
            <form id="reponse_message">
            <input type="text" id='input_reponse' placeholder="Ecrire un message..." onChange={majContent}></input>
            <button id="bouton_reponse" onClick={repondreMessage}>Repondre</button>
            </form>
            <a className="btn_responses"  onClick={chargementReponses}>
                {affichageReponses ? "Masquer réponses" : "Voir réponses"}
            </a>

            
                
                {affichageReponses ? <div><ReponseList liste={reponses} /></div> : ""}
            
            
        </div>
    )

}

export default Message;