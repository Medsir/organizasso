const express = require("express");
const app = express();
const path = require("path");
const port = 8000;
const cors = require('cors');
app.use(cors({origin:'*'}))

app.use(express.json())

app.get('/', (req, res) => {
    res.setHeader('Content-type', 'text/plain;charset=UTF-8');
    res.send("Message reçu");
}).post('/', (req, res)=>{
    console.log("Requête POST reçue :"+req.body.texte)
    res.end();
});



app.listen(port, ()=>{
    console.log("Le serveur est connecté : http://localhost:"+port)
})