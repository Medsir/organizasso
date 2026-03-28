import axios from 'axios';
import { useState , useEffect, useRef } from 'react'


function Test(){
    var [champ, setChamp] = useState('');
    const handleInput = (e) => {
        setChamp(e.target.value);
    };

    const envoi = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8000/', {texte:champ}).then(console.log("envoi de la requete POST"))
    }

    return(
        <>
            <form>
                <label htmlFor="input">Champ</label><input type="text" onChange={handleInput}></input>
                <button onClick={envoi}>OK</button>
            </form>
        </>
    )
}

export default Test