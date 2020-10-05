import ReconnectingWebSocket from "reconnecting-websocket";
import { Dictionary } from "vue-router/types/router";
import { Event } from "reconnecting-websocket";
import loglevel from "loglevel";
import store from '@/store';
import _clone from 'lodash/clone';
import { mutations } from "@/store/types";
import { websocketBaseUrl } from '@/config';

export class Websocket {
    public ws!: ReconnectingWebSocket;
    private messageId = 1;
    private handlers: Dictionary<Function> = {};

    constructor(uri: string, onOpen?: (event: Event) => void) {
        this.ws = new ReconnectingWebSocket(uri);

        if (onOpen) {
            this.ws.addEventListener("open", onOpen);
        }

        this.ws.addEventListener("message", ({ data }) => {
            const { event, payload } = JSON.parse(data);

            const handler = this.handlers[event];

            if (handler) {
                handler(payload);
            }
        });
    }

    send (payload: Dictionary<any>): void {
        if (!payload.id) {
            payload.id = this.messageId++;
        }

        if (!payload.token) {
            payload.token = store.state.token;
        }

        loglevel.debug(`WS.send:: payload: ${JSON.stringify(payload)}`);

        this.ws.send(JSON.stringify(payload));
    }

    on (message: string, handler: Function) {
        this.handlers[message] = handler;
    }
}

const ws = new Websocket(websocketBaseUrl, () => { console.log(`Websocket opened`); });

let timeout = new Date().getTime();

ws.on('sparkline', ({ sparkline, ticker}: { sparkline: number[], ticker: string}) => {
    const now = new Date().getTime();
    if (now - timeout > 1000) {
        timeout = now;

        const signals = _clone(store.state.signals);

        signals.forEach(signal => {
            if (signal.ticker === ticker) {
                signal.sparkline = sparkline;
            }
        });

        store.commit(mutations.SET_SIGNALS, { signals });
    }
});

export default ws;
