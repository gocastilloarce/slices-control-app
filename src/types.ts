export enum KeyActions {
    RIGHT = 'right',
    LEFT = 'left'
}

export enum PresentationActions {
    START = 'start',
    STOP = 'stop'
}

export enum ApiActions {
    LOGIN = 'login',
    KEYACTION = 'key',
    PRESENTATIONACTION = 'presentation'
}

export interface Message {
    event: ApiActions
    body: any
}