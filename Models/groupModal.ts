import groupInterface from "../Interfaces/groupInterface";
import Message from "./messageModal";


class Group {
    id : string;
    idClientA: string;
    idClientB: string;
    messages : Message[];

    constructor(value : groupInterface){
        this.id = value.id;
        this.idClientA = value.idClientA;
        this.idClientB = value.idClientB;
        this.messages = value.messages;
    }
}

export default Group;