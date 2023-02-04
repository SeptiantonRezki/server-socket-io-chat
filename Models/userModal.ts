import userInterface from "../Interfaces/userInterface";

class User {
    idUser: string;
    idSocket?: string | null;
    name: string;
    username: string;
    password: string;
    imageUrl: string;
    statusOnline: Boolean;
    lastOnline: string;

    constructor(value : userInterface) {
        this.idUser = value.idUser;
        this.idSocket = value.idSocket;
        this.name = value.name;
        this.username = value.username;
        this.password = value.password;
        this.imageUrl = value.imageUrl;
        this.statusOnline = value.statusOnline;
        this.lastOnline = value.lastOnline;
    }
}

export default User;