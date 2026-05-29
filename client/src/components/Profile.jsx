import { useState, useEffect } from 'react';
import axios from 'axios';
import MessageList from "./MessageList";
import '../css/profile.css';

function Profile(props){
    const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
    const [message, setMessage] = useState('');
    const [publicMessages, setMessages] = useState([]);
    const [profile, setProfile] = useState({});

    const targetUserId = props.userId;

    const loadUserInfo = () => {
        const url = targetUserId 
            ? `http://localhost:3000/profile/${targetUserId}` 
            : "http://localhost:3000/profile";

        axios.get(url, { withCredentials: true })
            .then((res) => {
                setProfile(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement profil :", err);
            });
    };

    const deleteMessageHandler = async (messageId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
            try {
                await axios.delete(`http://localhost:3000/messages/${messageId}`, { withCredentials: true });
                
                setMessages(publicMessages.filter(msg => 
                    msg._id !== messageId && msg.idReponse !== messageId
                ));
                setMessage("Message supprimé avec succès.");
                
                setTimeout(() => setMessage(''), 3000); 
            } catch (err) {
                console.error("Erreur lors de la suppression :", err);
                setMessage("Erreur lors de la suppression du message.");
            }
        }
    };

    useEffect(() => {
        setProfile({});
        loadUserInfo();
    }, [targetUserId]);

     useEffect(() => {
        if (profile && profile.publicMessages) {
            const messagesTries = [...profile.publicMessages].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            setMessages(messagesTries );
        }
    }, [profile]);


    return (
        <div className="profile_container">
            
            {message && <p>{message}</p>}
            
            {Object.keys(profile).length === 0 ? (
                <p className="profile_loading">
                    Chargement du profil...
                </p>
            ) : (
                <div className="profile_card">
                    <div className="profile_header">
                        <img 
                            className="profile_avatar_large" 
                            src={profile.avatar === "default" ? defaultAvatarUrl : profile.avatar} 
                            alt="photo de profil"
                        />
                        <h2 className="profile_username">{profile.userName}</h2>
                        
                        <span className={"profile_role" +profile.status ? profile.status : ''}>
                            {profile.status}
                        </span>
                    </div>
                
                    <div className="profile_body">
                        <h3 className="profile_section_title">
                            Messages publics
                        </h3>
                        
                        {publicMessages.length > 0 ? (
                            <MessageList liste={publicMessages}
                                         onDelete={deleteMessageHandler} 
                                         showDelete={!targetUserId || props.isAdmin}/>
                        ) : (
                            <p className="profile_no_messages">
                                Vous n'avez publié aucun message dans le fil public.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;