import { State } from '@/types/store/state';

export default {
    isLoggedOn: (state: State) => !!(state.token && state.user && state.user.id),
};
