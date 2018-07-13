export interface Message {
    type: MessageType;
    title?: string;
    description?: string;
}

export enum MessageType {
    NONE = 'NONE',
    INFO = 'INFO',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    CANCEL = 'CANCEL',
}
