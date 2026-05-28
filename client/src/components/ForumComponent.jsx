import { useState, useEffect } from "react";
import NavigationPanel from "./NavigationPanel";
import MessageList from "./MessageList";
import axios from "axios";
import '../css/forum.css';


function ForumComponent(props){
    const resultatRecherche = props.resultatRecherche
    
    //On doit attendre le chargement de la requête get avec axios pour pouvoir l'afficher
    const [messages, setMessages] = useState([]);
    const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

    


    const [charge, setCharge] = useState(false); 
    const [erreur, setErreur] = useState('');
    const [profile, setProfile] = useState({});
    useEffect(() => {
        if(!charge){
            axios.get("http://localhost:3000/messages?idReponse=null", {withCredentials:true}).then(
                (res) => {
                    console.log("reponse OK")
                    setCharge(true);
                    setMessages(res.data);
                }
            ).catch((error) => {
                setErreur(error.response.data.message)
            })  
        }
    }, [charge]);

    const changeForumHandler = async () =>{
        try{
            setErreur("Chargement...")
            const forum = document.getElementById('forum_selector').value
            await axios.get("http://localhost:3000/messages?forum="+forum+"&idReponse='null'", {withCredentials:true}).then(
                    (res) => {
                        setMessages(res.data);
                        setErreur('')
                    }
                )  
        }
        catch(error){
            //Gestion de l'affichage des erreurs selon le retour de la requête
            if(error.response && error.response.status == 403){
                setErreur(error.response.data.message)
            }
        }
    }


    const updateMessagesHandler = async () => {
        try{
            const forum = document.getElementById('forum_selector').value
            await axios.get("http://localhost:3000/messages?forum="+forum, {withCredentials:true}).then(
                    (res) => {
                        setMessages(res.data);
                        setErreur('')
                    }
                )  
        }
        catch(error){
            //Gestion de l'affichage des erreurs selon le retour de la requête
            if(error.response && error.response.status == 403){
                setErreur(error.response.data.message)
            }
        } 
    }


    useEffect(()=>{
        setMessages(resultatRecherche)

    }, [resultatRecherche])



    //chargement du profil
    useEffect(()=>{
            axios.get("http://localhost:3000/profile", {withCredentials:true}).then(
                (res) =>{
                    setProfile(res.data);
                }
            ).catch(
                (error) =>{
                    setErreur(error.response.data.message);
                }
            )
        }, [])



    const sendMessage = (event)=>{
        event.preventDefault();
        const content = document.getElementById('message_input').value;
        document.getElementById('message_input').value = "";
        const forum = document.getElementById('forum_selector').value;
        console.log(content);
        if(!content || content == ''){
            return -1;
        }
        axios.put("http://localhost:3000/messages", {content:content,forum:forum, idReponse:"null"}, {withCredentials:true}).then(
            (res)=>{
                updateMessagesHandler();
            }
        ).catch(
                (error) => {
                    setErreur(error.response.data.message)
                }
            )
    }

    return(
            <>
            <div className="forum_container">
                <aside className="forum_aside">
                    <div className="forum_infos_profil">
                        <img 
                            className="forum_profil_image" 
                            src={profile.avatar === "default" ? defaultAvatarUrl : profile.avatar} 
                            alt="photo de profil" 
                        />
                        {!profile.userName ? (
                            <p>chargement</p>
                        ) : (
                            <p className="forum_username">{profile.userName}</p>
                        )}
                        <p className="forum_role_label">Vous avez le rôle :</p>
                        
                        {profile.userName && (
                            <span className={`forum_role_badge ${profile.status ? profile.status.toLowerCase() : ''}`}>
                                {profile.status}
                            </span>
                        )}
                    </div>
                </aside>
                <div className="forum_fil">
                    <form className="forum_form_message">
                        <input type="text" id='message_input' placeholder="Ecrire un message..."></input>
                        <button onClick={sendMessage}>Envoyer</button>
                    </form>
                    
                    {erreur === '' ? (
                        <MessageList liste={messages} onUserClick={props.onUserClick}/>
                    ) : (
                        <p>{erreur}</p>
                    )}
                </div>
                <aside className="forum_aside forum_options">
                    <select className="forum_select" id="forum_selector" onChange={changeForumHandler}>
                        <option value="public">Forum Public</option>
                        <option value="private">Forum Privé</option>
                    </select>

                    <button className="forum_btn_action" onClick={updateMessagesHandler}>
                        Actualiser le fil
                    </button>
                </aside>
                
            </div>
            </>
        )
}

export default ForumComponent;