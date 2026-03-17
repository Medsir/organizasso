import { useState , useEffect } from 'react'
import NavigationPanel from './NavigationPanel';
import Signin from './SignIn';

function Livre(props){
    var dateAffichage = props.date.getDate()+"/"+props.date.getMonth()+"/"+props.date.getFullYear()

    return(
        <>
        <li>Titre : {props.titre} ; Auteur : {props.auteur} ; Cote : {props.cote}</li>
        <p style={{color:props.status?"green":"red"}}>{props.status ? "Livre disponible" : "Livre Emprunté le "+dateAffichage}</p>
        </>
    )


}

export default Livre; 