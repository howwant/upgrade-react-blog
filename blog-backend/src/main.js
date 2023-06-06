require('dotenv').config();
import Koa from 'koa'
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
// import createFakeData from './createFakeData';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

// 비구조화
const { PORT, MONGO_URL } = process.env; 
// process에 에러메시지가 뜨지만 dotenv가 작동이 잘되어 실행도 잘됨 => 즉 에러가 떠도 실행은 잘됨

mongoose
    .connect(MONGO_URL ,{})
    .then(() => {
        console.log('Connected to MongoDB')
        // createFakeData();
    })
    .catch((e) => {
        console.error(e)
    })


const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes());

// 라우터 적용 전에 bodyparser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

router.get('/about/:name?', ctx => {
    const { name } = ctx.params;
    // name의 유무에 따라 다른 결과 출력
    ctx.body = name ? `${name}의 소개`:'소개';
})
router.get('/posts', ctx => {
    const { id } = ctx.query;
    // id의 존재 유무에 따라 다른결과 출력
    ctx.body = id ? `포스트 #${id}`: '포스트 아이디가 없습니다.'
})


const port = PORT || 4000;

app.listen(port, () => {
    console.log('listening to port %d', port)
})

// 테스트용
// router.get('/', ctx => {
//     ctx.body ='홈';
// })
// app.use(async(ctx, next) => {
//     console.log(ctx.url)
//     console.log(1)
//     if (ctx.query.authorized !== '1') {
//         ctx.status = 401;
//         return;
//     }
//     await next();
//     console.log('END')
// })

// app.use((ctx, next) => {
//     console.log(2)
//     next();
// })

// app.use(ctx => {
//     ctx.body = 'hello world'
// })