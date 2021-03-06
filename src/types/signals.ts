import { Changeable, Dictionary, Timestampable } from './base';
import { Comment } from './blog';

export interface LocalizedComment extends Dictionary {
    key: string;
    ordersIds?: number[];
}

export interface EntryPoint extends Changeable, Timestampable {
    id: number;
    price: number;
    comment: string;
    signalId: number;
}

export interface Order extends Changeable, Timestampable {
    id: number;
    price: number;
    volume: number;
    comment: string;
    signalId: number;
    type: 'take profit' | 'stop loss';
    closed?: boolean;
    closedVolume?: number;
}

export interface Channel extends Timestampable {
    id?: number;
    name: string;
    description?: string;
}

export interface Signal extends Changeable, Timestampable {
    id: number;
    userId: number;

    status: 'delayed' | 'active' | 'finished' | 'cancelled';
    profitability: number;
    ticker: string;
    title: string;
    channel?: Channel;
    price: number;
    type: 'short' | 'long';
    risk: 'high' | 'medium' | 'low';
    term: 'short' | 'medium' | 'long';
    volume: number;
    paid: boolean;
    commentable: boolean;
    date?: Date;
    post?: string;
    comments: Comment[];
    entryPoints: EntryPoint[];
    takeProfitOrders: Order[];
    stopLossOrders: Order[];

    remaining?: number;

    // Client-side runtime data

    priceStatus?: '' | 'above' | 'below';
    sparkline?: number[];
    comment?: string;
    comment_localized?: LocalizedComment;
}

export const defaultEntryPoint = (overrides = {}) => ({
    id: 0,
    price: 0,
    comment: '',
    signalId: 0,
    ...overrides,
});

export const defaultTakeProfit = (overrides = {}) => ({
    id: 0,
    price: 0,
    volume: 0,
    comment: '',
    signalId: 0,
    type: 'take profit' as 'take profit',
    ...overrides,
});

export const defaultStopLoss = (overrides = {}) => ({
    id: 0,
    price: 0,
    volume: 0,
    comment: '',
    signalId: 0,
    type: 'stop loss' as 'stop loss',
    ...overrides,
});

export const defaultSignal = (override = {}): Signal => {
    const data = {
        id: 0,
        status: 'delayed' as 'delayed',
        profitability: 0,
        ticker: '',
        title: '',
        channel: {
            name: '',
        },
        price: 0,
        type: 'long' as 'long',
        risk: 'low' as 'low',
        term: 'long' as 'long',
        volume: 0,
        paid: false,
        commentable: true,

        remaining: 1,

        userId: 0,
        comments: [],
        entryPoints: [],
        takeProfitOrders: [],
        stopLossOrders: [],

        ...override,
    };

    if (!data.channel) {
        data.channel = { name: '' };
    }

    return data;
};
