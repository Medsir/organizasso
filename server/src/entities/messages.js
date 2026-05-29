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
            const avatar = user.avatar;
            const res = await this.db.collection("messages").insertOne({authorId, userName, content, date, forum, idReponse, avatar});
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

    async deleteMessage(messageId, userId, isAdmin) {
        try {
            const id = new ObjectId(messageId);
            const message = await this.db.collection("messages").findOne({ _id: id });
            
            if (!message) return false; 

            if (message.authorId === userId || isAdmin) {
                const res = await this.db.collection("messages").deleteOne({ _id: id });
                await this.db.collection("messages").deleteMany({ idReponse: messageId });
                return res.deletedCount === 1;
            }
            
            return false; 
        } catch (error) {
            console.error("Erreur lors de la suppression du message :", error);
            return false;
        }
    }
}

exports.default = Messages;