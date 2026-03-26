import { useState , useEffect } from 'react'

function Login(){
    var [login, setLogin] = useState('')
    var [mdp, setMDP] = useState('')

    return(
        <>
            <form id='formulaire_login'>
            <label htmlFor="login_input">Login</label><input type="text" id="login_input"></input>
            <label htmlFor="password_input">Mot de passe</label><input type="password" id="password_input"></input>
            <button type="submit" className="form_button">Connexion</button>
            <button type="reset" className="form_button">Annuler</button>
            </form>
        </>
    )
}

export default Login