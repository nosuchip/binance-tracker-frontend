import { Changeable, Timestampable } from './base';

export interface Comment extends Changeable, Timestampable {
    id: number;
    text: string;
    signalId: number;
}

export interface Post extends Changeable, Timestampable {
    id: number;
    title: string;
    text: string;
    comments: Comment[];
}
