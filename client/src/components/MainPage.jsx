import { useState , useEffect } from 'react'
import NavigationPanel from './NavigationPanel';
import MessageList from './MessageList';
import Login from './Login';
import Signin from './SignIn';

function MainPage(){
    const [connected, setConnected] = useState(false);

    const setLogin = () => {
        setConnected(true);
        setPage("message_page")
    }
    const setLogout = () => {
        setConnected(false);
        setPage("login_page");
    }

    const setSignIn = () =>{
        setConnected(false);
        setPage("SignIn")
    }

    const [page, setPage] = useState("login_page")
    
    if(page == "message_page"){
    return(
            <>
            <NavigationPanel connected={connected} logout={setLogout}/>
            <MessageList liste={[{author:"Mehdi", content:"test"},{author:"Mehdi", content:"test2"}]}/>
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