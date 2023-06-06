import { createAction, handleActions } from "redux-actions";

const SET_USER = 'user/SET_USER';

export const setUser = createAction(
    SET_USER, username => username,
);

const initialState = {
    username : null,
};
export default handleActions (
    {
        [SET_USER]:(state, {payload: username}) => ({
            ...state,
            username,
        }),
    },
    initialState,
);