import { ActionReducer, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '@env/environment.prod';

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

const metaReducersDev: MetaReducer<any>[] = [
    storeFreeze,
    logger
];

const metaReducersProd: MetaReducer<any>[] = [
    storeFreeze
];

export const metaReducers = environment.production ? metaReducersProd : metaReducersDev;
