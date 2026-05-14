import axios from 'axios';
import { useState , useEffect } from 'react'

function Login(props){
    var [login, setLogin] = useState('')
    var [mdp, setMDP] = useState('')

    var [errorMessage, setErrorMessage] = useState('');

    const getLogin = (event) => {
        setLogin(event.target.value);
    }

    const getPassword = (event) => {
        setMDP(event.target.value);
    }
    const resetChamps = (event) =>{
        setLogin('');
        setMDP('');
        setErrorMessage('');
    }

    

    function checkLogin(event){
        console.log("Check login")
        event.preventDefault();

        if(!login || !mdp){
            login = document.getElementById("login_input").value;
            mdp = document.getElementById("password_input").value;
        }


        axios.post("http://localhost:3000/user", 
            { login:login, password:mdp }, {withCredentials:true}
        )
        .then((res) => {
            if(res.status === 200){
                props.login();
            }
        })
        .catch((error) => {
            if(error.response){
                if(error.response.status == 400) setErrorMessage("Veuillez spécifier tous les champs.");
                if(error.response.status == 403) setErrorMessage("Mot de passe/identifiant incorrect.");
            }
        });
        
    }


    return(
        <>
            <form id='formulaire_login'>
            <h1>Connexion</h1>
            <label htmlFor="login_input">Login</label><input type="text" id="login_input" onChange={getLogin}></input>
            <label htmlFor="password_input">Mot de passe</label><input type="password" id="password_input" onChange={getPassword}></input>
            <button type="submit" className="form_button" onClick={checkLogin}>Connexion</button>
            <button type="reset" className="form_button" onClick={resetChamps}>Annuler</button>
            <button onClick={props.setSignIn}>Je n'ai pas de compte</button>
            </form>
            <br></br>
            <p>{errorMessage}</p>
        </>
    )
}

export default Login