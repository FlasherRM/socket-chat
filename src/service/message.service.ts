import {IMessage, IMessageResult} from "../interfaces";

export default class MessageService {
    private messages: IMessage[]
    private badWords: string[]

    constructor() {
        this.messages = []
        this.badWords = ["fuck", "shit", "bitch"]
    }

    addMessage(message: IMessage): IMessageResult {
        if (this.badWords.some(word => message.message.toLowerCase().includes(word))) {
            return {
                success: false,
                message: `${message.name} використав погане слово!`
            }
        }
        this.messages.push(message)
        return {
            success: true
        }
    }

    getMessages(): IMessage[] {
        return this.messages;
    }
}