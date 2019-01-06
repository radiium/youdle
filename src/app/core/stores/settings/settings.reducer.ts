import { SettingsState } from './settings.model';
import { SettingsActions, SettingsActionTypes } from './settings.actions';

export const initialState: SettingsState = {
    savePath: '',
    concurrentDownload: 3
};

export function settingsReducer(
    state: SettingsState = initialState,
    action: SettingsActions): SettingsState {

    switch (action.type) {
        case SettingsActionTypes.LOAD_SETTINGS_STATE:
            return state;

        case SettingsActionTypes.SET_SETTINGS_STATE:
            return { ...state, ...action.payload };

        case SettingsActionTypes.EDIT_SAVE_PATH:
            return state;

        case SettingsActionTypes.SET_SAVE_PATH:
            return { ...state, savePath: action.payload };

        case SettingsActionTypes.SET_CONCURRENT_DL:
            return { ...state, concurrentDownload: action.payload };

        case SettingsActionTypes.INCREMENT_CONCURRENT_DL:
            return {
                ...state,
                concurrentDownload: incrementValue(state.concurrentDownload)
            };

        case SettingsActionTypes.DECREMENT_CONCURRENT_DL:
            return {
                ...state,
                concurrentDownload: decrementValue(state.concurrentDownload)
            };

        case SettingsActionTypes.SET_SUCCESS:
            return state;

        default:
            return state;
    }
}

const incrementValue = (value: number) => {
    value++;
    if (value > 10) { value = 10; }
    return value;
};

const decrementValue = (value: number) => {
    value--;
    if (value < 1) { value = 1; }
    return value;
};
