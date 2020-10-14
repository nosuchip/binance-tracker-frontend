import Vue from 'vue';
import { EventEmitter } from "events";
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Dictionary } from 'vue-router/types/router';
import loglevel from 'loglevel';
import store from '@/store';
import _clone from 'lodash/clone';
import { mutations } from '@/store/types';
import { websocketBaseUrl } from '@/config';
import { Signal } from "@/types/signals";

export class Websocket extends EventEmitter {
    public ws!: ReconnectingWebSocket;
    private messageId = 1;

    constructor(uri: string) {
        super();

        this.ws = new ReconnectingWebSocket(uri);

        this.ws.addEventListener('open', () => { this.emit('open'); });
        this.ws.addEventListener('close', () => { this.emit('close'); });

        this.ws.addEventListener('message', ({ data }) => {
            const { event, payload } = JSON.parse(data);
            this.emit(event, payload);
        });
    }

    // eslint-disable-next-line
    send(payload: Dictionary<any>): void {
        if (!payload.id) {
            payload.id = this.messageId++;
        }

        if (!payload.token) {
            payload.token = store.state.token;
        }

        loglevel.debug(`WS.send:: payload: ${JSON.stringify(payload)}`);

        this.ws.send(JSON.stringify(payload));
    }
}

const ws = new Websocket(websocketBaseUrl);

let timeout = new Date().getTime();

ws.on('sparkline', ({ sparkline, ticker }: { sparkline: number[]; ticker: string }) => {
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

const updateSignals = (signals: Signal[]) => {
    console.log(`WS.updateSignals:: signals = ${JSON.stringify(signals)}`);

    const copy = _clone(store.state.signals);

    signals.forEach(signal => {
        const index = copy.findIndex(s => s.id === signal.id);

        if (index !== -1) {
            copy[index] = { ...copy[index], ...signal };
        } else {
            copy.push(signal);
        }
    })

    store.commit(mutations.SET_SIGNALS, { signals: copy });
}

ws.on('open', () => {
    console.log(`Websocket (re)connected`);
    Vue.toasted.info('You are online now');

    if (store.state.available.length) {
        console.log(`Resubscribing to existing available signals ${store.state.available.join(',')}`);
        store.commit(mutations.SET_AVAILABLE_SIGNALS, { available: store.state.available });
    }
});

ws.on('close', () => {
    console.log(`Websocket disconnected`);

    Vue.toasted.error('You are offline, reconnecting...');
})
ws.on('signals', updateSignals);
ws.on('signal', (signal: Signal) => updateSignals([signal]) );

export default ws;
