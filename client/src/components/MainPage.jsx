import { useState , useEffect } from 'react'
import NavigationPanel from './NavigationPanel';
import MessageList from './MessageList';
import Login from './Login';
import Signin from './SignIn';
import axios from 'axios';
import ForumComponent from './ForumComponent';

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
        setConnected(true);
        setPage("message_page");
    }

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
                
            }
        ).catch(
            (error) =>{
                setConnected(false);
                setPage("login_page");
            }
        )
    }, [])



    const setSignIn = () =>{
        setConnected(false);
        setPage("SignIn")
    }


    if(page == "message_page"){
        return(
                <>
                <NavigationPanel connected={connected} logout={setLogout} setRecherche={setRecherche}/>
                <ForumComponent resultatRecherche={msgRecherche}/>
                </>
            )
    }
    if(page=="SignIn"){
        return(
            <>
            <div class="login_container">
            <Signin page="signin_page"/>
            </div>
            </>
        )

    }
    else{
        return (
            <>
            <div class="login_container">
                
            <Login login={setLogin} setSignIn={setSignIn}/>
            </div>
            </>
        )
    }

}

export default MainPage