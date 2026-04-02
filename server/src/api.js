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

const internalErrorJson = {
    status:500,
    message:"Erreur interne, désolé ! Veuillez réessayer ultérieurement."
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function init(db){
    console.log("Initialisation de l'API...");
    const router = express.Router();
    router.use(express.json());


    //Instance des utilisateurs de la bdd
    const users = new Users.default(db.db("organizasso"));
router.get('/toto', (req, res) => res.send('youoi'));

    //Service createUser (/user/ avec PUT)
    router.put('/user', async (req, res) =>{
        console.log("test")
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
    router.post('/user/', async (req, res)=>{
        try{
            const {login, password} = req.body;

            if(!login || !password) return res.status(400).json(champManquantJson);
            if(!users.exists(login)) return res.status(401).json({status:401, message:"Utilisateur inconnu"});

            // Todo : Initialiser une session
            const userid = users.checkPassword(login, password);
            if(userid != null){
                req.session.regenerate(function (erreur){
                    if(erreur){
                        return res.status(500).json(internalErrorJson);
                    }
                    else{
                        //On stocke l'id user dans la session
                        req.session.id = userid;
                        return res.status(201).json({status:201, message:"Connexion réussie."});
                    }
                })
            }else{
                req.session.destroy((err) => {});
                return res.status(403).json({status:403, message:"Accès refusé, mot de passe incorrect."});
            }
        }
        catch(error){
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }


    })
    return router;
}


function test(){
    console.log("Test de l'API...");
    const router = express.Router();
    router.use(express.json());



    const init = async () =>{
        const uri = "mongodb://localhost";
        const client = new MongoClient(uri);

        try{
            console.log("Connexion a la base de données ...")
            await client.connect();
            await client.db("test").collection("users")
        }
        catch(e){
            console.error(e);
        }
        finally{
            await client.close();
        }
    }


    router.get('/user/', (req, res)=>{
        const uri = "mongodb://localhost";
        const client = new MongoClient(uri);
        const test= async() =>{
            await client.connect();
            const users = new Users.default(client.db("test"));
            await users.create("Mehdi", "mehdi@mail.fr", "motdepasse2");
            await client.close()
            };
        test();
    })
    return router
}
exports.deflaut = init