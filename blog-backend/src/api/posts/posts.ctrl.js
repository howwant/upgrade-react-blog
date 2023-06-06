import Post from "../../models/post";
import mongoose from "mongoose";
import Joi from 'joi'

const { ObjectId } = mongoose.Types;

export const getPostById = async (ctx, next) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400;
        return;
    }
    try {
        const post = await Post.findById(id);
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.state.post = post;
        return next();
    } catch (e) {
        ctx.throw(500, e)
    }
};

export const write = async ctx => {
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(),
        tags: Joi.array()
        .items(Joi.string())
        .required(),
    });
    const result = schema.validate(ctx.request.body)
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { title, body, tags } = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
        user: ctx.state.user,
    });
    try {
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};
export const list = async ctx => {
    const page = parseInt(ctx.query.page || '1', 10);
    if(page < 1 ){
        ctx.status = 400;
        return;
    }
    const { tag, username } = ctx.query;
    const query = {
        ...(username ? { 'user.username': username }: {}),
        ...(tag ? { tags : tag } : {}),
    }
    try {
        const posts = await Post.find(query)
        .sort({ _id: -1 })
        .limit(10)
        .skip((page - 1) * 10)
        .lean()
        .exec();
        const postCount = await Post.countDocuments(query).exec();
        ctx.set('Last-Page', Math.ceil(postCount/ 10));
        ctx.body = posts
            .map(post => ({
                ...post,
                body:
                post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`
            }));
    } catch (e) {
        ctx.throw(500, e)
    }
};
export const read = async ctx => {
    // const { id } = ctx.params;
    try {
        // const post = await Post.findById(id).exec();
        // if(!post) {
        //     ctx.status = 404;
        //     return;
        // }
        ctx.body = ctx.state.post;
    } catch (e) {
        ctx.throw(500, e)
    }
};
export const remove = async ctx => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch (e){
        ctx.throw(500, e)
    }
};
export const update = async ctx => {
    const { id } = ctx.params;

    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
    });
    const result = schema.validate(ctx.request.body)
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true,
        }).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e){
        ctx.throw(500, e)
    }
};

export const checkOwnPost = (ctx, next) => {
    const { user, post } = ctx.state;
    if(post.user._id.toString() !== user._id ){
        ctx.status = 403;
        return;
    }
    return next();
};


// 몽고 프레스 사용 이전 작성법
//
// let postId = 1;

// // posts 배열 초기 데이터
// const posts = [
//     {
//         id: 1,
//         title: '제목',
//         body: '내용',
//     },
// ];

// // 포스트 작성
// export const write = ctx => {
//     const { title, body } = ctx.request.body;
//     postId++;
//     const post = { id: postId, title, body };
//     posts.push(post);
//     ctx.body = post; 
// };

// // 목록 조회
// export const list = ctx => {
//     ctx.body = posts;
// };

// // 특정 포스트 조회
// export const read = ctx => {
//     const { id } = ctx.params;
//     const post = post.find(p => p.id.toString() === id );
//     if(!post){
//         ctx.status = 404;
//         ctx.body = {
//             message: '포스트가 존재하지 않습니다.',
//         };
//         return;
//     }
//     ctx.body = post;
// };

// // 특정 포스트 제거
// export const remove = ctx => {
//     const { id } = ctx.params;
//     const index = posts.findIndex(p => p.id.toString() === id );
//     if(index === -1 ){
//         ctx.status = 404;
//         ctx.body = {
//             message: '포스트가 존재하지 않습니다.',
//         };
//         return;
//     }
//     // index번째 아이템을 제거합니다
//     posts.splice(index, 1)
//     ctx.status = 204;
// }

// // 포스터 수정 교체
// export const replace = ctx => {
//     const { id } = ctx.params;
//     const index = posts.findIndex(p => p.id.toString() === id );
//     if(index === -1 ){
//         ctx.status = 404;
//         ctx.body = {
//             message: '포스트가 존재하지 않습니다.',
//         };
//         return;
//     }
//     posts[index] = {
//         id,
//         ...ctx.request.body,
//     };
//     ctx.body = posts[index];
// };
// // 포스터 수정 특정 필드 변경
// export const update = ctx => {
//     const { id } = ctx.params;
//     const index = posts.findIndex(p => p.id.toString() === id );
//     if(index === -1 ){
//         ctx.status = 404;
//         ctx.body = {
//             message: '포스트가 존재하지 않습니다.',
//         };
//         return;
//     }
//     // 기존값에 값을 덮어씌움
//     posts[index] = {
//         ...posts[index],
//         ...ctx.request.body,
//     };
//     ctx.body = posts[index];
// };