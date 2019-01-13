import { ActionReducer, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
    return (state, action) => {
        const newState = reducer(state, action);
        console.log(`[NGRX_DEBUG] action: ${action.type}`, {
            payload: (<any>action).payload,
            oldState: state,
            newState
        });
        return newState;
    };
}

export const metaReducers: MetaReducer<any>[] = [
    logger,
    storeFreeze
];
