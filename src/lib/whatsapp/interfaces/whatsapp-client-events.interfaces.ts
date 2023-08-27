export interface WaClientDisconnectedEvent {
    clientId: string;
}
export interface WaClientReadyEvent {
    clientId: string;
}
export interface WaClientQrCodeReceivedEvent {
    clientId: string;
    qrCode: string;
}
export interface WaClientAuthenticatedEvent {
    clientId: string;
}
export interface WaClientAuthFailureEvent {
    clientId: string;
}
export interface WaClientMessageEvent {
    clientId: string;
    message: any;
}