export class WebsocketSession
{
    publish: (channel: string, data: any) => void;
    subscribe: (channel: string, callback: any) => void;
    unsubscribe: (channel: string) => void;
}