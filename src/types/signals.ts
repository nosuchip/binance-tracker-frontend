import { Changeable, Timestampable } from './base';

export interface Signal extends Changeable, Timestampable {
    id: number;
    status: string;
    ticker: string;
    profitability: number;
    risk: string;
    term: string;
    volume: number;
    paid: boolean;
    commentsAllowed: boolean;
    price: number;

    imageUrl?: string;

    // Client-side runtime data

    priceStatus?: '' | 'above' | 'below';
    sparkline?: number[];
}
