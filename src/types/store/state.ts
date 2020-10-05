import { UserInfo, AuthToken } from '../user-info';
import { Commit } from 'vuex';
import { Signal } from "../signals";

export interface State {
    loading: boolean;
    loadingMessage?: string;

    user: UserInfo | null;
    token: AuthToken;

    signals: Signal[];
}

export interface ActionState {
    commit: Commit;
    state: State;
}
