import { backendJsonplaceholder } from "../services/backend";
import { adapterJsonplaceholder } from "./frontend";


export function adapterComments(comments: backendJsonplaceholder.TComments): adapterJsonplaceholder.TComments {
    return {
        body: comments.body,
        email: comments.email,
        id: comments.id,
        uuid: comments.postId,
        name: comments.name,
    }
}

export function adapterPost(post: backendJsonplaceholder.TPost): adapterJsonplaceholder.TPost {
    return {
        body: post.body,
        id: post.id,
        title: post.title,
        uuid: post.userId
    }
}

export function adapterUser(user: backendJsonplaceholder.TUser): adapterJsonplaceholder.TUser {
    return {
        email: user.email,
        id: user.id,
        name: user.name,
        username: user.username
    }
}