const { ObjectId } = require("mongodb");

class Users {
    constructor(db){
        this.db = db;
    }


    async exists(login) {
         //On cherche UN utilisateur dans la BDD qui a pour login la valeur de la variable login
        const user = await this.db.collection("users").findOne({login:login});
        return user != null;
    }

    async isMember(userid){
        const user = await this.db.collection("users").findOne({_id:new ObjectId(userid)});
        return user.status === "Membre" || user.status === "Admin";
    }

    async isAdmin(userid){
        const user = await this.db.collection("users").findOne({_id:new ObjectId(userid)});
        console.log(user.status)
        return user.status === "Admin";
    }

    async canAccess(userid, forum){
        if(forum === "public"){
            return await this.isMember(userid) || await this.isAdmin(userid);
        }
        if(forum === "private"){
            return await this.isAdmin(userid);
        }
        return -1; //Le forum n'existe pas (ou mal écrit)
    }

    async create(userName, login, password){
        const res = await this.db.collection("users").insertOne({userName, login, password, status:"en attente"});
        console.log("utilisateur créé avec l'id "+res.insertedId)
        return res.insertedId;
    }

    async checkPassword(login, password){
        const user = await this.db.collection("users").findOne({login:login});
        if(user && (user.password == password)){
            return user._id;
        }
        return null;
    }
}

exports.default = Users;