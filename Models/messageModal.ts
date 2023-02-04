import messageInterface from "../Interfaces/messageInterface";
import User from "./userModal";

class Message {
    user : User;
    idMessage: string;
    textMessage: string;
    constructor(value: messageInterface){
        this.user = value.user;
        this.idMessage = value.idMessage;
        this.textMessage = value.textMessage;
    }
}

export default Message;