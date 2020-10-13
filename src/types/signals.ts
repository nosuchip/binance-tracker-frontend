import { Changeable, Timestampable } from './base';
import { Comment } from './blog';

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
}

export interface Signal extends Changeable, Timestampable {
    id: number;
    status: 'delayed' | 'active' | 'fired' | 'cancelled';
    profitability: number;
    ticker: string;
    title: string;
    price: number;
    type: 'short' | 'long';
    risk: 'high' | 'medium' | 'low';
    term: 'short' | 'medium' | 'long';
    volume: number;
    paid: boolean;
    commentable: boolean;
    userId: number;
    comments: Comment[];
    entryPoints: EntryPoint[];
    takeProfitOrders: Order[];
    stopLossOrders: Order[];

    // Client-side runtime data

    priceStatus?: '' | 'above' | 'below';
    sparkline?: number[];
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

export const defaultSignal = (override = {}): Signal => ({
    id: 0,
    status: 'delayed',
    profitability: 0,
    ticker: '',
    title: '',
    price: 0,
    type: 'long',
    risk: 'low',
    term: 'long',
    volume: 0,
    paid: false,
    commentable: true,

    userId: 0,
    comments: [],
    entryPoints: [],
    takeProfitOrders: [],
    stopLossOrders: [],

    ...override,
});
