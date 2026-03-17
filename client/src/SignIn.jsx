function Signin(props){

    if(props.page == 'signin_page'){
        return(
            <>
            <form id="formulaire_login">
            <label htmlFor="Prenom_input" className="Nom">Prenom</label><label htmlFor="Nom_input" className="Nom">Nom</label>
            <input type="text" id="Prenom_input"></input><input type="text" id="Nom_input"></input>
            <label htmlFor="login_input">Login</label><input type="text" id="login_input"></input>
            <label htmlFor="password_input">Mot de passe</label><input type="password" id="password_input"></input>
            <label htmlFor="password_input">Retapez</label><input type="password" id="password_input"></input>
            <button type="submit" className="formulaire_login">Enregistrer</button>
            <button type="reset" className="formulaire_login">Annuler</button>
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