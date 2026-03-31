import { useState , useEffect } from 'react'

function Login(){
    var [login, setLogin] = useState('')
    var [mdp, setMDP] = useState('')

    const getLogin = (event) => {
        setLogin(event.target.value);
    }

    const getPassword = (event) => {
        setMDP(event.target.value);
    }

    return(
        <>
            <form id='formulaire_login'>
            <label htmlFor="login_input">Login</label><input type="text" id="login_input" onChange={getLogin}></input>
            <label htmlFor="password_input">Mot de passe</label><input type="password" id="password_input" onChange={getPassword}></input>
            <button type="submit" className="form_button">Connexion</button>
            <button type="reset" className="form_button">Annuler</button>
            </form>
        </>
    )
}

export default Login