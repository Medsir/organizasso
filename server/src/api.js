const express = require('express');
const Users = require("./entities/users.js");
const champManquantJson = {
                status:400,
                message:"Champ Manquants"
            };
const mailInvalideJson = { 
            status: 400, 
            message: "Le login doit être une adresse email valide." 
        };
const mdpInvalideJson = { 
            status: 400, 
            message: "Le mot de passe doit avoir au moins 8 caractères." 
        };
const checkMdpJson = { 
            status: 400, 
            message: "Les deux champs de mot de passe et confirmation ne sont pas identiques." 
        };
const conflictJson = {
        status:409,
        message:"l'utilisateur existe déjà"
    };
const userCreated = {
        status:201,
        message:"l'utilisateur a bien été créé."
    };
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function init(db){
    const router = express.Router();
    router.use(express.json());

    //Instance des utilisateurs de la bdd
    const users = new Users.default(db);

    //Service createUser (/user/ avec PUT)
    router.put('/user/', async (req, res) =>{
        const {userName, login, password, confirmation} = req.body;

        //Verification, si l'un des champs est vide : Renvoyer une erreur 400 : bad request 
        if(!userName || !login || !password || !confirmation) return res.status(400).json(champManquantJson);

        try{
            //Ouverture de la base de données : Collection users
            if(users.exists(login)) return res.status(409).json(conflictJson); 
            //Ajout : Regex pour le format du login qui doit être une adresse mail.
            if(!emailRegex.test(login)) return res.status(400).json(mailInvalideJson);
            //Ajout : Mot de passe de taille 8 minimum
            if(password.length < 8) return res.status(400).json(mdpInvalideJson);
            //Confirmation
            if(password !== confirmation) return res.status(400).json(checkMdpJson);
            
            //Tout est OK, on crée l'utilisateur
            await users.create(userName, login, password);
            return res.status(201).json(userCreated);
        }
        catch(error){
            console.error(error);
            return res.status(500).json(
                {
                    status:500,
                    message:"Erreur interne, désolé ! Veuillez réessayer ultérieurement."
                }
            )
        }
    });

    //Service Login : 
    router.post('POST', async (req, res)=>{
        try{
            const {login, password} = req.body;

            if(!login || !password) return res.status(400).json(champManquantJson);
            if(!users.exists(login)) return res.status(401).json({status:401, message:"Utilisateur inconnu"})

            








                


        }
        catch(error){
            console.error(error);
            return res.status(500).json(
                {
                    "status":500,
                    "message":"Erreur interne, désolé ! Veuillez réessayer ultérieurement."
                }
            )
        }


    })

}