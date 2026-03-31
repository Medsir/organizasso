import { useState , useEffect } from 'react'

function Login(props){
    var [login, setLogin] = useState('')
    var [mdp, setMDP] = useState('')

    const getLogin = (event) => {
        setLogin(event.target.value);
    }

    const getPassword = (event) => {
        setMDP(event.target.value);
    }


    function checkLogin(event){
        //plus tard
        props.login();
    }


    return(
        <>
            <form id='formulaire_login'>
            <h1>Connexion</h1>
            <label htmlFor="login_input">Login</label><input type="text" id="login_input" onChange={getLogin}></input>
            <label htmlFor="password_input">Mot de passe</label><input type="password" id="password_input" onChange={getPassword}></input>
            <button type="submit" className="form_button" onClick={checkLogin}>Connexion</button>
            <button type="reset" className="form_button">Annuler</button>
            <button onClick={props.setSignIn}>Je n'ai pas de compte</button>
            </form>
        </>
    )
}

export default Login