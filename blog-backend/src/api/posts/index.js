import Router from "koa-router";
import * as postsCtrl from "./posts.ctrl";
import checkLoggedIn from "../../lib/checkLoggedIn";

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

const post = new Router();
post.get('/', postsCtrl.read);
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
// posts.put('/:id', postsCtrl.replace);
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

posts.use('/:id', postsCtrl.getPostById, post.routes());

export default posts;

// import es6 이전 사용법
// module.exports = posts;

// const Router = require('koa-router');
// const postsCtrl = require('./posts.ctrl');

// const printInfo = ctx => {
//     ctx.body = {
//         method: ctx.method,
//         path: ctx.path,
//         params: ctx.params,
//     };
// };