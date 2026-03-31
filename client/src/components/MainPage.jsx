import { useState , useEffect } from 'react'
import NavigationPanel from './NavigationPanel';
import MessageList from './MessageList';

function MainPage(){
    const [connected, setConnected] = useState(false);

    const getConnected = () => connected;
    const setLogout = () => setConnected(false);

    return(
            <>
            <NavigationPanel connected={getConnected()} login={getConnected} logout={setLogout}/>
            <MessageList liste={[
                {author:"Mehdi", content:"test"},
                {author:"Mehdi", content:"test2"}
            ]}/>
            </>
        )
    


}

export default MainPage