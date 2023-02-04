import User from "../Models/userModal";

interface messageInterface {
    user: User,
    idMessage: string,
    textMessage : string,
}

export default messageInterface;