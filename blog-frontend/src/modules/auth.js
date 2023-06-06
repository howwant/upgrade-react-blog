import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import createRequestSaga, { createRequestActionTypes } from "../lib/createRequestSaga";
import { takeLatest } from 'redux-saga/effects';
import * as authAPI from '../lib/api/auth';

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const [ REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE ] = createRequestActionTypes(
    'auth/REGISTER',
);
// const REGISTER = 'auth/REGISTER';
// const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
// const REGISTER_FAILURE = 'auth/REGISTER_FAILURE';

const [ LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE ]  = createRequestActionTypes(
    'auth/LOGIN',
);
// const LOGIN = 'auth/LOGIN';
// const LOGIN_SUCCESS= 'auth/LOGIN_SUCCESS';
// const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

export const changeField = createAction(
    CHANGE_FIELD,
    ({ form, key, value}) => ({
        form, //register,login
        key, //username, password, passwordConfirm
        value, //실제 바꾸려는 값
    }),
);

export const initializeForm = createAction(INITIALIZE_FORM, form => form);

// 사가 로딩 작업
export const register = createAction(REGISTER, ({ username, password })=> ({
    username,
    password,
}));
export const login = createAction(LOGIN, ({ username, password})=>({
    username,
    password
}));
// 사가 생성
const registerSaga = createRequestSaga(REGISTER, authAPI.register);// register 통신
const loginSaga = createRequestSaga(LOGIN, authAPI.login);

export function* authSaga() {
    yield takeLatest(REGISTER, registerSaga);
    yield takeLatest(LOGIN, loginSaga);
}

const initialState = {
    register : {
        username: '',
        password: '',
        passwordConfirm:'',
    },
    login: {
        username: '',
        password: '',
    },
    auth: null,
    authError: null,
};

const auth = handleActions(
    {
        [CHANGE_FIELD]: (state, { payload: { form, key, value }}) =>
            produce(state, draft => {
                draft[form][key] = value
            }),
        [INITIALIZE_FORM]: (state, { payload: form }) => ({
            ...state,
            [form]: initialState[form],
            authError: null, // 폼 전환 시 회원인증 에러 초기화
        }),
        // 회원가입 성공 사가
        [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
            ...state,
            authError: null,
            auth,
        }),
        // 회원가입 실패 사가
        [REGISTER_FAILURE]: (state, { payload: error }) => ({
            ...state,
            authError: error,
        }),
        // 로그인 성공 사가
        [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
            ...state,
            authError: null,
            auth,
        }),
        // 로그인 실패 사가
        [LOGIN_FAILURE]: (state, { payload: error }) => ({
            ...state,
            authError: error,
        }),
    },
    initialState,
)

export default auth;