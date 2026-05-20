import axios from "axios"
import Login from "./Login"
import Logout from "./Logout"
import '../css/nav.css';

function NavigationPanel(props){
    

    const search = async(event) => {
        event.preventDefault();

        const forumValue = document.getElementById("forum_selector") ? document.getElementById("forum_selector").value : ""; 
        const contentValue = document.getElementById("barre_recherche_input").value;
        const dateDebut = document.getElementById("recherche_date_debut").value; 
        const dateFin = document.getElementById("recherche_date_fin").value;
        
        const params = new URLSearchParams();
        
        if (forumValue) params.append("forum", forumValue);
        if (contentValue) params.append("content", contentValue);
        if (dateDebut) params.append("dateDebut", dateDebut);
        if (dateFin) params.append("dateFin", dateFin);

        var recherche = "?" + params.toString();



        axios.get("http://localhost:3000/messages"+recherche, {withCredentials:true}).then(
            (res) =>{
                props.setRecherche(res.data);
            }
        ).catch(
            (error) =>{
                console.log(error)
            }
        )
    }

    

    return(
        <>
        <nav id="navigation_panel">
            <img src="../../../public/favicon.svg" alt="logo.png" id="logo"></img>
            <form id="barre_recherche">
                <input type="text" name="search" id="barre_recherche_input" placeholder="Rechercher du texte"></input>
                <input type="date" name="date_debut" id="recherche_date_debut"></input>
                <input type="date" name="date_fin" id="recherche_date_fin"></input>
                <button onClick={search}>Rechercher</button>
            </form>
            <button onClick={props.setProfil}>Profil 👤</button>
            {props.isAdmin ? <button onClick={props.setAdmin}>Admin🛡️</button> : null}
            <Logout logout={props.logout}/>
        </nav>

        
        </>
    )
    
}

export default NavigationPanel