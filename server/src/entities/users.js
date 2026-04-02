class Users {
    constructor(db){
        this.db = db;
    }


    async exists(login) {
         //On cherche UN utilisateur dans la BDD qui a pour login la valeur de la variable login
        const user = await this.db.findOne({login:login});
        return user != null;
    }

    async create(userName, login, password){
        const res = await this.db.collection("users").insertOne({userName, login, password});
        return res.insertedId;
    }

    async checkPassword(login, password){
        const user = await this.db.findOne({login:login});
        if(user && (user.password === password)){
            return user.id;
        }
        return null;
    }

}

exports.default = Users;