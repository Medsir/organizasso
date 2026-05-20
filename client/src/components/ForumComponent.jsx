import { useState, useEffect } from "react";
import NavigationPanel from "./NavigationPanel";
import MessageList from "./MessageList";
import axios from "axios";


function ForumComponent(props){
    const resultatRecherche = props.resultatRecherche
    
    //On doit attendre le chargement de la requête get avec axios pour pouvoir l'afficher
    const [messages, setMessages] = useState([]);
    

    


    const [charge, setCharge] = useState(false); 
    const [erreur, setErreur] = useState('');
    const [profile, setProfile] = useState({});
    useEffect(() => {
        if(!charge){
            axios.get("http://localhost:3000/messages", {withCredentials:true}).then(
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
        axios.put("http://localhost:3000/messages", {content:content,forum:forum, idReponse:'null'}, {withCredentials:true}).then(
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
            <aside>

                <div className="infos_profil">
                    <img id="infos_profil_image" src="https://media.tenor.com/JhTKOCxtk4UAAAAe/ryan-gosling.png" alt="photo de profil" />
                    {profile == {} ? <p>chargement</p> : <p id="infos_username">{profile.userName}</p>}
                    <p id="role">Vous avez le rôle</p>
                    {profile == {} ? <p></p> : <p id={"role_"+profile.status}>{profile.status}</p>}

                </div>

            </aside>


            <div className="fil">
            <form id='formulaire_message'>
            <input type="text" id='message_input' contenteditable="true" placeholder="Ecrire un message"></input>
            <button onClick={sendMessage}>Envoyer</button>
            </form>
            {erreur === '' ? <MessageList liste={messages}/> : <p>{erreur}</p>}
            </div>

            <aside className="options_aside">
                <select name="choixForum" id="forum_selector" onChange={changeForumHandler}>
                    <option value="public">Forum Public</option>
                    <option value="private">Forum Privé</option>
                </select>

                <button onClick={updateMessagesHandler}>Actualiser le fil</button>
            </aside>
            </div>
            </>
        )
}

export default ForumComponent;