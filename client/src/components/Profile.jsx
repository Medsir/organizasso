import { useState, useEffect } from 'react';
import axios from 'axios';
import MessageList from "./MessageList";
import '../css/dashboard.css';


function Profile(props){
    const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
    var [attenteProfil, setAttenteProfil] = useState([]);
    var [message, setMessage] = useState('');

    var [publicMessages, setMessages] = useState([]);
    var [profile, setProfile] = useState({});


    const loadUserInfo = () => {
        axios.get("http://localhost:3000/profile", { withCredentials: true })
            .then((res) => {
                setProfile(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement profil :", err);
            });
    };

    useEffect(() => {
        loadUserInfo();
    }, []);

     useEffect(() => {
        setMessages(profile.publicMessages);
    }, [profile]);


    return (
        <>
        <div className="admin_dashboard">
            <h2>Profil Principal</h2>
            {message && <p>{message}</p>}
            
            {!profile ? (
                <p>Aucun utilisateur</p>
            ) : (
                <table className="admin_table">
                    <div>
                        <div className="infos_profil">
                        <img id="infos_profil_image" src={profile.avatar == "default" ? defaultAvatarUrl : profile.avatar} alt="photo de profil"/>
                        {profile == {} ? <p>chargement</p> : <p id="infos_username">{profile.userName}</p>}
                        <p id="role">Vous avez le rôle</p>
                        {profile == {} ? <p></p> : <p id={"role_"+profile.status}>{profile.status}</p>}

                        </div>
                    
                        <MessageList liste={publicMessages}/>
                    </div>
                </table>
            )}
        </div>
        </>
    );
}


export default Profile;