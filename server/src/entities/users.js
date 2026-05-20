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
        const res = await this.db.collection("users").insertOne({userName, login, password, status:"en attente", dateCreation:new Date(), avatar:"default"});
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

    async getProfile(userId){
        const user = await this.db.collection("users").findOne({_id:new ObjectId(userId)});
        //const profil = await this.db.collection("profil").findOne({_id:userId});
        const publicMessages = await this.db.collection("messages").find({authorId:userId, forum:"public"}, {limit: 50});
        const privateMessages = await this.db.collection("messages").find({authorId:userId, forum:"private"}, {limit: 50}); //Limité aux 50 derniers messages
        if(!user) return null;
        //Infos utilisateur : userName, login, status, date creation de compte
        //Infos profil collection profil : Bio, avatar url
        //Listes à renvoyer : Messages publics, Messages Privés
        const pbm = await publicMessages.toArray();
        const pvm = await privateMessages.toArray()
        return {
            userName:user.userName,
            email:user.login,
            status:user.status,
            dateCreation:user.dateCreation,
            //bio:profil.biographie,
            avatar:user.avatar,
            publicMessages:pbm,
            privateMessages:pvm
        }
        


    }

    async getUsersAttente() {
        return await this.db.collection("users").find({ status: "en attente" }).toArray();
    }

    async validerUser(userid) {
        const res = await this.db.collection("users").updateOne(
            { _id: new ObjectId(userid) },
            { $set: { status: "Membre" } }
        );
        return res.modifiedCount === 1;
    }


    async promote(userid) {
        const res = await this.db.collection("users").updateOne(
            { _id: new ObjectId(userid) },
            { $set: { status: "Admin" } }
        );
        return res.modifiedCount === 1;
    }


    async deleteUser(userid){
        if(await this.isAdmin(userid)) return false; // On ne va pas laisser les admin bannir les admin
        const res = await this.db.collection("users").deleteOne({_id:new ObjectId(userid)})
        return res.deletedCount > 0;
    }

    async getUserList(){
        return await this.db.collection("users").find().toArray();
    }

}




exports.default = Users;