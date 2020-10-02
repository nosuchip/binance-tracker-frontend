import { Credentials } from '../user-info';

export type LoginActionType = (credentials: Credentials) => Promise<void>;
