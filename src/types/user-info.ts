import { Changeable } from './base';

export interface UserInfo extends Changeable {
    id?: number;
    name: string;
    email: string;
    role: string;
    confirmedAt: Date;
    active: boolean;
}

export type AuthToken = string | null;

export interface Credentials {
    username: string;
    password: string;
}
