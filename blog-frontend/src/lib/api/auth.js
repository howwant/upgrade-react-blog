import client from "./client";

// 로그인
export const login = ({ username, password }) => {
    client.post('/api/auth/login', { username, password });
}

// 회원가입
export const regiser = ({ username, password }) => {
    client.posr('/api/auth/register', { username, password });
}

// 로그인 상태 확인
export const check = () => {client.get('/api/auth/check')};