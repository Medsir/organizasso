import Login from "./Login"
import Logout from "./Logout"

function NavigationPanel(props){

    return(
        <nav>{(props.isConnected) ? <Logout/> : <Login/>}</nav>
    )
    
}

export default NavigationPanel