const { ObjectId } = require("mongodb");

class Messages {
    constructor(db){
        this.db = db;
    }

    async createMessage(authorId, content, date, forum, idReponse){
        const user = await this.db.collection("users").findOne({_id:new ObjectId(authorId)})
        if(user != null){
            if(forum == "privé" && (user.status != "admin")){
                return null; //Si l'utilisateur n'a pas accès au forum privé il ne peut pas poster de message
            }
            const userName = user.userName;
            const res = await this.db.collection("messages").insertOne({authorId, userName, content, date, forum, idReponse});
            return res.insertedId;
        }
        return null;
    }

    async getMessages(query, options){
        const messages = await this.db.collection("messages").find(query, options).sort({date:-1});
        return messages.toArray();
    }

    async getReponses(messageId){
        const id = new ObjectId(messageId);
        const messages = await this.db.collection("messages").find({_id:id});
        return messages.toArray();
    }
}

exports.default = Messages;