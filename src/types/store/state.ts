import { UserInfo, AuthToken } from '../user-info';
import { Commit } from 'vuex';

export interface State {
    loading: boolean;
    loadingMessage?: string;

    user: UserInfo | null;
    token: AuthToken;
}

export interface ActionState {
    commit: Commit;
    state: State;
}
