import { useState } from 'react';
import axios from 'axios';


function Signin(props){

    var [userName, setUserName] = useState('')
    var [login, setLogin] = useState('')
    var [password, setPassword] = useState('')
    var [confirmation, setConfirmation] = useState('')

    const getUserName = (event) => {
        setUserName(event.target.value);
    }

    const getLogin = (event) => {
        setLogin(event.target.value);
    }

    const getPassword = (event) => {
        setPassword(event.target.value);
    }

    const getConfirmation = (event) => {
        setConfirmation(event.target.value);
    }

    if(props.page == 'signin_page'){

        const sendRequest = (event) =>{
            event.preventDefault();

            axios.put("http://localhost:3000/user", {
                userName: userName,
                login: login,
                password: password,
                confirmation: confirmation
            })
            .then((res) => {
                alert(res.data.message);
                
                if(props.onRedirect){
                    props.onRedirect();
                }
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    alert(error.response.data.message);
                } else {
                    alert("Une erreur est survenue.");
                }
            });
        }



        return(
            <>
            <form id="formulaire_login" onSubmit={sendRequest}>
                <h1>Inscription</h1>
            <label htmlFor="Prenom_input" className="Nom">Votre Pseudonyme</label>
                <input type="text" id="Prenom_input" onChange={getUserName} value={userName}></input>
                
                <label htmlFor="login_input">Login</label>
                <input type="text" id="login_input" onChange={getLogin} value={login}></input>
                
                <label htmlFor="password_input">Mot de passe</label>
                <input type="password" id="password_input" onChange={getPassword} value={password}></input>
                
                <label htmlFor="confirmation_input">Retapez le mot de passe</label>
                <input type="password" id="confirmation_input" onChange={getConfirmation} value={confirmation}></input>
                
                <button type="submit" className="formulaire_login">Enregistrer</button>
                <button type="button" className="formulaire_login" onClick={props.onRedirect}>Annuler</button>
            </form>
            </>
        )
        
    }
    else{
        if(props.page == 'login_page'){
            return(<button>S'inscrire</button>)
        }
    }
}

export default Signin