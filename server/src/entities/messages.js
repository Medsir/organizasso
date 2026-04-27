class Messages {
    constructor(db){
        this.db = db;
    }

    async createMessage(authorId, content, date, forum, idReponse){
        const user = this.db.collection("users").findOne({authorId:authorId})
        if(user != null){
            if(forum == "privé" && (user.status != "admin")){
                return null; //Si l'utilisateur n'a pas accès au forum privé il ne peut pas poster de message
            }
            const res = await this.db.collection("messages").insertOne({authorId, content, date, forum, idReponse});
            return res.insertedId;
        }
        return null;
    }

    async deleteMessage(authorId){

    }
}

exports.default = Messages;