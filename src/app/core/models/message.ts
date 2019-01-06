import { MessageType } from './message-type';

export interface Message {
    type: MessageType;
    title: string;
    description: string;
}
