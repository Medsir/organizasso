import axios from "axios"
import Login from "./Login"
import Logout from "./Logout"

function NavigationPanel(props){
    

    const search = async(event) => {
        event.preventDefault();

        var recherche = "?";
        const forum = "forum="+document.getElementById("forum_selector").value; //quel forum est selectionné ?
        const content ="content="+document.getElementById("barre_recherche_input").value; //valeur du champ de la recherche (à developper pour l'instant username pour tester)
        if (forum && forum != ''){
            recherche = recherche + forum;
            recherche = recherche + '&'+ content;
        }
        else{
            recherche = recherche + content;
        }


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
                <input type="date" name="date_debut" id="recherche_date"></input>
                à
                <input type="date" name="date_fin" id="recherche_date"></input>
                <button onClick={search}>Rechercher</button>
            </form>
            {props.isAdmin ? <button onClick={props.setAdmin}>Admin Dashboard</button> : null}
            <Logout logout={props.logout}/>
        </nav>

        
        </>
    )
    
}

export default NavigationPanel