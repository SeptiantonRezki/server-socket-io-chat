import Message from "../Models/messageModal";


interface groupInterface {
    id : string;
    idClientA : string;
    idClientB : string;
    messages : Message[]
}

export default groupInterface;