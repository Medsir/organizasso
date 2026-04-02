const api = require('./api.js');
const express = require("express");
const app = express();
const path = require("path");
const port = 8000;
const cors = require('cors');
const {MongoClient} = require('mongodb');
const session = require("express-session");

app.use(cors({origin:'*'}))
app.use(express.json())
app.use(session({
    secret:"technoweb rocks", //?
    resave:true,
    saveUninitialized:false
}))

app.get('/', (req, res) => {
    res.setHeader('Content-type', 'text/plain;charset=UTF-8');
    res.send("Message reçu");
}).post('/', (req, res)=>{
    console.log("Requête POST reçue :"+req.body.texte)
    res.end();
});
 
//Initialisation de l'API (nécessitera la bdd plus tard)



// Connexion à la base de données 
const uri = "mongodb://localhost";
const client = new MongoClient(uri);

const apiRouter = api.deflaut(client);
app.use("/", apiRouter);


app.listen(port, ()=>{
    console.log("Le serveur est connecté : http://localhost:"+port)
})