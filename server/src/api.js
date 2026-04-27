const express = require('express');
const Users = require("./entities/users.js");
const Messages = require("./entities/messages.js");

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
    const database = db.db("OrganizAsso");


    //Instance des utilisateurs de la bdd
    const users = new Users.default(database);
    const messages = new Messages.default(database)
  
    router.use((req, res, next) => {
        console.log('Nouvelle Requête : \nAPI: methode %s, chemin %s', req.method, req.path);
        console.log('Corps:', req.body);
        next();
    });

    //Création d'une fonction de vérification d'authentification
    //Cette fonction permet de vérifier que la session est bien initalisée afin de pouvoir manipuler la session
    const isAuthentificated = (req) =>{
        return req.session && req.session.userId; //Si ces données sont disponibles alors on peut avancer.
    }



    //Service SignIn
    router.put('/user', async (req, res) =>{

        const {userName, login, password, confirmation} = req.body;

        //Verification, si l'un des champs est vide : Renvoyer une erreur 400 : bad request 
        if(!userName || !login || !password || !confirmation) return res.status(400).json(champManquantJson);

        try{
            //Ouverture de la base de données : Collection users
            if(await users.exists(login)) return res.status(409).json(conflictJson); 
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

    //Service Login
    router.post('/user', async (req, res)=>{
        try{
            const {login, password} = req.body;

            if(!login || !password) return res.status(400).json(champManquantJson);
            if(!users.exists(login)) return res.status(401).json({status:401, message:"Utilisateur inconnu"});

            // Todo : Initialiser une session
            const userid = await users.checkPassword(login, password);
            if(userid != null){
                req.session.regenerate(function (erreur){
                    if(erreur){
                        return res.status(500).json(internalErrorJson);
                    }
                    else{
                        //On stocke l'id user dans la session
                        req.session.userId = userid;
                        return res.status(200).json({status:200, message:"Connexion réussie."});
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


    //Service createMessage
    router.put('/messages', async (req, res) =>{
        try{
            //Remarque : on assure l'authentification avec le middleware express-session
            if(isAuthentificated(req)){
                

                const authorId = req.session.userId; //ici on récupère l'ID utilisateur depuis la session (stocké côté serveur au moment du login donc secure)
                const date = new Date(); //Pour éviter que le client choisisse la date d'envoi
    
                const {content, forum, idReponse} = req.body;
                const isMember = await users.isMember(authorId);
                const canAccess = await users.canAccess(authorId, forum);

                //Vérifier les champs
                if(!content ||!forum || !idReponse) return res.status(400).json(champManquantJson);

                //Verifier le droit d'envoyer dans le forum
                if(!isMember) return res.status(403).json({status:403, message:"Vous devez attendre la validation de votre compte."});
                if(!canAccess) return res.status(403).json({status:403, message:"Vous n'avez pas accès à ce forum"});
                if(canAccess == -1) return res.status(404).json({status:404, message:"Le forum n'existe pas ou est mal spécifié. (public/private)"})

                // Si tout est bon, on crée le message
                const id = await messages.createMessage(authorId, content, date, forum, idReponse);
                return res.status(201).json({status:201, message:"Message créé correctement avec l'id"+id});
            }
            return res.status(403).json({status:403, message:"Vous n'êtes pas authentifié."});
        }
        catch(error){
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }
    })

    //service getMessages : l'utilisateur doit avoir accès au forum (obligatoirement spécifié), autres paramètres : idMessage, idUser
    // Todo

    






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