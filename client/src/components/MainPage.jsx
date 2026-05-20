import { useState , useEffect } from 'react'
import NavigationPanel from './NavigationPanel';
import MessageList from './MessageList';
import Login from './Login';
import Signin from './SignIn';
import axios from 'axios';
import ForumComponent from './ForumComponent';
import AdminDashboard from './AdminDashboard';

function MainPage(){

    //Connected sert a savoir si l'utilisateur est actuellement connecté (il a une session ouverte)
    const [connected, setConnected] = useState(false);
    
    const [page, setPage] = useState("login_page");

    const [profile, setProfile] = useState({});
    
    const [msgRecherche, setMsgRecherche] = useState([]);


    const setRecherche = (liste) =>{
        setMsgRecherche(liste);
    }


    const setLogin = () => {
        axios.get("http://localhost:3000/profile", { withCredentials: true })
            .then((res) => {
                setProfile(res.data);
                setConnected(true);
                setPage("message_page");
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération du profil après connexion :", err);
                setConnected(true);
                setPage("message_page");
            });
    };

    const setLogout = async () => {
       await axios.post("http://localhost:3000/disconnect", {}, {withCredentials:true})
       setConnected(false);
       setPage("login_page")
    }

    useEffect(()=>{
        axios.get("http://localhost:3000/connected", {withCredentials:true}).then(
            (res) =>{
                setConnected(true);
                setPage("message_page");
                
            axios.get("http://localhost:3000/profile", {withCredentials: true})
                    .then((profileRes) => {
                        setProfile(profileRes.data);
                    })
                    .catch((err) => console.log("Erreur chargement profil", err));
            }
        ).catch(
            (error) =>{
                setConnected(false);
                setPage("login_page");
                setProfile({});
            }
        )
    }, []);



    const setSignIn = () =>{
        setConnected(false);
        setPage("SignIn")
    }

    const setAdmin = ()=>{
        setPage("AdminDashboard");
    }

    const setMainPage = ()=>{
        setPage("message_page");
    }

    if(page == "message_page"){
        return(
                <>
                <NavigationPanel connected={connected} logout={setLogout} setRecherche={setRecherche} setAdmin={setAdmin} isAdmin={profile.status == "Admin"}/>
                <ForumComponent resultatRecherche={msgRecherche}/>
                </>
            )
    }
    if(page=="SignIn"){
        return(
            <>
            <div className="login_container">
            <Signin page="signin_page" onRedirect={setLogout}/>
            </div>
            </>
        )

    }
    if(page=="AdminDashboard"){
        return(
            <>
            <button className="ban_user_btn" id="bouton_retour_admin" onClick={setMainPage}>Retour à la page Principale</button>
            {profile.status == "Admin" && < AdminDashboard setMainPage={setMainPage}/>}
            </>

        )
    }
    else{
        return (
            <>
            <div className="login_container">
                
            <Login login={setLogin} setSignIn={setSignIn}/>
            </div>
            </>
        )
    }

}

export default MainPage