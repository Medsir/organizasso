import Login from "./Login"
import Logout from "./Logout"

function NavigationPanel(props){

    return(
        <>
        <nav id="navigation_panel">
            <img src="../../../public/favicon.svg" alt="logo.png" id="logo"></img>
            <form id="barre_recherche">
                <input type="text" name="search" id="barre_recherche_input"></input>
                <input type="date" name="date_debut" id="recherche_date"></input>
                à
                <input type="date" name="date_fin" id="recherche_date"></input>
                <button type="submit">Rechercher</button>
            </form>
            {props.connected ? <Logout logout={props.logout}/>: <Login login={props.login}/>}
        </nav>

        
        </>
    )
    
}

export default NavigationPanel