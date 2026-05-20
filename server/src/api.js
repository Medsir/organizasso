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
            if(!users.exists(login)) return res.status(403).json({status:403, message:"Mot de passe/identifiant incorrect."});

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
                return res.status(403).json({status:403, message:"Mot de passe/identifiant incorrect."});
            }
        }
        catch(error){
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }
    })

    //Service profil (renvoie les informations de l'utilisateur connecté grâce a la session)
    router.get('/profile', async(req, res) =>{
        if(!isAuthentificated(req)) return res.status(403).json({status:403, message:"Vous n'êtes pas authentifié."});
        const response = await users.getProfile(req.session.userId);
        return res.status(200).json(response);
    });

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
                if(id == null){
                    return res.status(403).json({status:403, message:"Vous n'avez pas accès à ce forum"});
                }
                return res.status(201).json({status:201, message:"Message créé correctement avec l'id"+id});
            }
            
            return res.status(403).json({status:403, message:"Vous n'êtes pas authentifié."});
        }
        catch(error){
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }
    })

    //service getMessages : l'utilisateur doit avoir accès au forum (obligatoirement spécifié), autres paramètres : idReponse, idUser, date
    // Todo
    router.get("/messages", async (req, res) =>{
        try{
            //Verifier l'authentification
            if(!isAuthentificated(req)) return res.status(403).json({status:403, message:"Vous n'êtes pas authentifié."});
            //Construction de la requête mongo db 
            var forum;
            req.query.forum ? forum = req.query.forum : forum = "public";
            const query = {forum:forum}
            if(req.query.content){
                query.content = {
                $regex: req.query.content, //recherche du contenu dans la bdd
                $options: 'i'
            };
        }
            if(req.query.idReponse) query.idReponse = req.query.idReponse;
            if(req.query.authorId) query.authorId = req.query.authorId;
            if(req.query.date) query.date = new date(date);

            const userId = req.session.userId;
            const canAccess = await users.canAccess(userId, forum);
             // Par défaut on cherchera dans le publique
            if(!canAccess) return res.status(403).json({status:403, message:"Vous n'avez pas accès à ce forum"});

            const r = await messages.getMessages(query, {});
            return res.status(200).json(r);
        }
        catch(error){
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }
    });
   

    router.get("/connected", async (req, res)=>{
        //Permet de savoir si l'utlisateur a une session ouverte ou non
        try{
            if(isAuthentificated(req)){
                return res.status(200).json({status:200, message:"Vous êtes bien connecté."})
            }
            else{
                return res.status(403).json({status:403, message:"Vous n'êtes pas authentifié."})
            }
        }catch(error){
            console.error(error);
        }

    })
    
    router.post("/disconnect", async (req, res)=>{
        //Permet de deconnecter l'utilisateur
        try{
            if(isAuthentificated(req)){
                req.session.destroy(()=>{console.log("session detruite")});
                res.clearCookie('connect.sid');
            }
            return res.status(200).json({status:200})
        }catch(error){
            console.error(error);
            return res.status(500).json({status:500, message:"Erreur lors de la fermture de la session."})
        }

    })
    router.get('/admin/attente', async (req, res) => {
        try {
            if (!isAuthentificated(req)) return res.status(403).json({ status: 403, message: "Vous n'êtes pas authentifié." });
            
            const userId = req.session.userId;
            const adminCheck = await users.isAdmin(userId);
            if (!adminCheck) return res.status(403).json({ status: 403, message: "Accès refusé. Réservé aux administrateurs." });

            const listeAttente = await users.getUsersAttente();
            return res.status(200).json(listeAttente);
        } catch (error) {
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }
    });

    router.patch('/admin/valider/:id', async (req, res) => {
        try {
            if (!isAuthentificated(req)) return res.status(403).json({ status: 403, message: "Vous n'êtes pas authentifié." });
            
            const userId = req.session.userId;
            const adminCheck = await users.isAdmin(userId);
            if (!adminCheck) return res.status(403).json({ status: 403, message: "Accès refusé. Réservé aux administrateurs." });

            const targetUserId = req.params.id;
            const success = await users.validerUser(targetUserId);

            if(success){
                return res.status(200).json({ status: 200, message: "L'utilisateur a bien été validé en tant que membre !" });
            }else{
                return res.status(404).json({ status: 404, message: "Utilisateur non trouvé ou déjà validé." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }
    });

    router.delete('/user/:id', async (req, res) => {
        
        try {
            if (!isAuthentificated(req)) return res.status(403).json({ status: 403, message: "Vous n'êtes pas authentifié." });
                
            const userId = req.session.userId;
            const adminCheck = await users.isAdmin(userId);
            if (!adminCheck) return res.status(403).json({ status: 403, message: "Accès refusé. Réservé aux administrateurs." });
            
            const targetUserId = req.params.id;
            const success = await users.deleteUser(targetUserId);

            if(success){
                return res.status(200).json({ status: 200, message: "L'utilisateur a bien été supprimé." });
            }else{
                return res.status(404).json({ status: 404, message: "Echec de la suppression de l'utilisateur." });
        }
    } catch (error) {
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }
    });


    router.get("/admin/userList", async(req, res)=>{
        try{
            if (!isAuthentificated(req)) return res.status(403).json({ status: 403, message: "Vous n'êtes pas authentifié." });
            
            const userId = req.session.userId;
            const adminCheck = await users.isAdmin(userId);
            if (!adminCheck) return res.status(403).json({ status: 403, message: "Accès refusé. Réservé aux administrateurs." });

            const liste = await users.getUserList();
            return res.status(200).json(liste);

        }catch (error) {
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }

    })


    router.patch('/admin/promote/:id', async (req, res) => {
        try {
            if (!isAuthentificated(req)) return res.status(403).json({ status: 403, message: "Vous n'êtes pas authentifié." });
            
            const userId = req.session.userId;
            const adminCheck = await users.isAdmin(userId);
            if (!adminCheck) return res.status(403).json({ status: 403, message: "Accès refusé. Réservé aux administrateurs." });

            const targetUserId = req.params.id;
            const success = await users.promote(targetUserId);

            if(success){
                return res.status(200).json({ status: 200, message: "L'utilisateur a bien été promu(e) !" });
            }else{
                return res.status(404).json({ status: 404, message: "Utilisateur non trouvé ou déjà validé." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json(internalErrorJson);
        }
    });


    return router;



}


exports.default = init