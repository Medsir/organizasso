import { useState , useEffect } from 'react'
import NavigationPanel from './NavigationPanel';
import Signin from './SignIn';
import Livre from '../Livre';
import TexteCallback from '../TexteCallback';
import Rwx from '../Rwx';

function MainPage(){
    const dateAuj = new Date(Date.now());
    const dateE = new Date("2026, 2, 23");

    
    var [titreCollection, setTitreCollection] = useState("Livres📚");
    var [liste, setListe] = useState([{auteur:"Victor Hugo", titre:"La légende des siècles", cote:"HUG001", emprunt:{status:true, dateEmprunt:dateAuj}},
        {auteur:"Victor Hugo", titre:"Les Misérables", cote:"HUG002", emprunt:{status:true, dateEmprunt:dateAuj}},
        {auteur:"Emile Zola", titre:"L'Assommoir", cote:"ZOL001", emprunt:{status:false, dateEmprunt:dateE}}
    ])

    /*
    var [currentPage, setCurrentPage] = useState('signin_page');
    var [isConnected, setConnected] = useState(false);
    const getConnected = () => {setCurrentPage("message_page"); setConnected(true)}
    const setLogout = ()=>{setCurrentPage("login_page"); setConnected(false)}
    */

    const addLivre = (e) =>{
        e.preventDefault();
        var title = e.target.form[0].value
        var author= e.target.form[1].value
        var c = e.target.form[2].value
        if (title!="" & author!="" & c!=""){
            setListe([...liste,{auteur:author, titre:title, cote:c, emprunt:{status:true, dateEmprunt:dateAuj}}]);
            e.target.form.reset() 
        }else{
            alert("Fais ça bien on t'as dit")
        }
        
    }


    return(
            <>
            <h1>{titreCollection}</h1>
            <p>--------------</p>
           
            <h2>Paramètres</h2>
            <label htmlFor='titre_input'>Titre de la collection</label><input id='titre_input' onChange={(e)=>{setTitreCollection(e.target.value)}}></input>
            <p>Date : {dateAuj.toDateString()}</p>

            
            <p>--------------</p>
            <h2>Ajouter un Livre</h2>
             <form>
            <label htmlFor='titre'>Titre</label><input type="text" id="titre"/><br />
            <label htmlFor="auteur">Auteur</label><input type="text" id="auteur"></input><br />
            <label htmlFor="cote">Cote</label><input type="text" id="cote"></input><br />
            <button onClick={addLivre}>Ajouter</button>
            </form>
            <p>--------------</p>
            
            <ul>
            {liste.map(livre => <Livre titre={livre.titre} auteur={livre.auteur} cote={livre.cote} status={livre.emprunt['status']} date={livre.emprunt['dateEmprunt']}/>)}
            </ul>
            
            <TexteCallback/>
            <Rwx/>

            </>



        )
    


}

export default MainPage